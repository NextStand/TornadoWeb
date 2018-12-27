# coding:utf-8
__author__ = 'BLUE'
__time__ = 'Mon Nov 05 2018 14:56:31 GMT+0800'

import uuid
import copy
import json
import hashlib
import config

from application.base.BaseHandler import BaseHandler
from application.db.MySQLHelper import db
from tornado import gen
from utils.Requestcmd import Requestcmd
from utils.session import Session
from utils.res_code import RET, RMS
from utils.comm_tools import MyEncoder


class sysuser(BaseHandler):
    @gen.coroutine
    def get(self):
        """ 获取管理员分页数据 """
        c1 = copy.deepcopy(self.args) if copy.deepcopy(self.args) else {}
        pageindex = c1.get('pageindex', 1) if c1.get(
            'pageindex', 1) > 0 else 1
        pagesize = c1.get('pagesize', 20) if c1.get(
            'pagesize', 20) > 0 else 1
        sql = 'select cu_userid,cu_usercode,cu_username,cu_state,cu_phone,cu_avator,cu_createtime from comp_sysuer where cu_from=0'
        sqlcount = 'select count(1) as _count from comp_sysuer where cu_from=0'
        if c1.get('key1', None):
            condition = Requestcmd.dict2like(dict(cu_username=c1.get('key1')), 'and')
            sql += ' and %s ' % condition
            sqlcount+=' and %s ' % condition
        sql += ' order by cu_createtime desc'
        sql += ' limit %s,%s' % ((int(pageindex)-1)*int(pagesize), pagesize)
        ret = None
        count = None  # 需要获取总数据量
        if c1.get('key1', None):
            ret = yield db.fetchall(sql, dict(cu_username='%'+c1.get('key1')+'%'))
            if c1.get('dbc') == 'yes':
                count = yield db.fetchall(sqlcount,dict(cu_username='%'+c1.get('key1')+'%'))
        else:
            ret = yield db.fetchall(sql)
            if c1.get('dbc') == 'yes':
                count = yield db.fetchall(sqlcount)
        result=dict(errcode=RET.OK, errmsg=RMS.OK,data=json.loads(json.dumps(ret, cls=MyEncoder)))
        if count:
            result.setdefault('datacount',count[0].get('_count'))
        self.write(result)

    @gen.coroutine
    def post(self):
        """ 新增管理员 """
        c1 = copy.deepcopy(self.args)
        if all((c1.get('cu_usercode'), c1.get('cu_username'), c1.get('cu_phone'))):
            cu_userid = uuid.uuid4().hex
            m = hashlib.md5()
            password = '%s%s' % (config.passwd_default, config.passwd_hash_key)
            m.update(password.encode('utf8'))
            password = m.hexdigest().upper()
            c1.setdefault('cu_userid', cu_userid)
            c1.setdefault('cu_password', password)
            yield Requestcmd.insert('comp_sysuer', c1)
            self.write(dict(errcode=RET.OK,
                            errmsg=u'新增成功,初始密码为"%s",请及时修改密码' % config.passwd_default, data=dict(cu_userid=cu_userid)))
        else:
            self.write(dict(errcode=RET.PARAMERR, errmsg=RMS.PARAMERR))

    @gen.coroutine
    def put(self):
        """ 修改管理员 """
        c1 = copy.deepcopy(self.args)
        uid = c1.pop('cu_userid', None)
        if uid:
            if c1.get('type', None) == 'reset':
                # 重置密码
                m = hashlib.md5()
                password = '%s%s' % (config.passwd_default,
                                     config.passwd_hash_key)
                m.update(password.encode('utf8'))
                password = m.hexdigest().upper()
                yield Requestcmd.update('comp_sysuer', dict(
                    cu_userid=uid), dict(cu_password=password))
                self.write(
                    dict(errcode=RET.OK, errmsg=u'重置成功,密码为"%s",请及时修改密码' % config.passwd_default))
            elif c1.get('type', None) == 'opt':
                # 冻结/正常/注销
                if c1.get('cu_state', None):
                    yield Requestcmd.update('comp_sysuer', dict(
                        cu_userid=uid), dict(cu_state=c1.get('cu_state')))
                    self.write(dict(errcode=RET.OK, errmsg=RMS.OK))
                else:
                    self.write(dict(errcode=RET.PARAMERR, errmsg=RMS.PARAMERR))
            else:
                # 修改
                yield Requestcmd.update('comp_sysuer', dict(
                    cu_userid=uid), c1)
                self.write(dict(errcode=RET.OK, errmsg=RMS.OK))
        else:
            self.write(dict(errcode=RET.PARAMERR, errmsg=RMS.PARAMERR))

    @gen.coroutine
    def delete(self):
        uid = self.args.pop('cu_userid', None)
        if uid:
            userinfo = Session(self)
            edtuid = userinfo.data.get('uid')
            if edtuid == '627263a4feba11e8bab15254005c9e8b' and edtuid != uid:
                yield Requestcmd.del4and('comp_sysuer', dict(cu_userid=uid))
                self.write(dict(errcode=RET.OK, errmsg=RMS.OK))
            else:
                self.write(dict(errcode=RET.ROLEERR, errmsg=RMS.ROLEERR))
        else:
            self.write(dict(errcode=RET.PARAMERR, errmsg=RMS.PARAMERR))
