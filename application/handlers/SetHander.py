# coding:utf-8
__author__ = 'BLUE'
__time__ = 'Sat Nov 10 2018 20:53:05 GMT+0800'
import uuid
import copy
import json
from tornado import gen
from application.base.BaseHandler import BaseHandler
from application.db.MySQLHelper import db
from utils.Requestcmd import Requestcmd
from utils.res_code import RET, RMS
from utils.comm_tools import MyEncoder
from utils.session import Session


class GisRegion(BaseHandler):
    @gen.coroutine
    def get(self):
        pid = self.args.get('pid', None) if self.args else '001'
        ret = None
        ret = self.redis.get('gis_allregion')
        if ret:
            ret = json.loads(ret)
        else:
            sql = 'SELECT r_id,r_pid,r_name FROM gis_region'
            ret = yield db.fetchall(sql)
            self.redis.set('gis_allregion',json.dumps(ret))
        self.write(dict(errcode=RET.OK, errmsg=RMS.OK, data=ret))


class BaseTree(BaseHandler):
    @gen.coroutine
    def get(self):
        ret = yield Requestcmd.find4or('base_tree', self.args)
        self.write(dict(errcode=RET.OK, errmsg=RMS.OK, data=ret))

    @gen.coroutine
    def post(self):
        try:
            c1 = copy.deepcopy(self.args)
            bt_treeid = uuid.uuid4().hex
            c1.setdefault('bt_treeid', bt_treeid)
            yield Requestcmd.insert('base_tree', c1)
        except Exception as e:
            self.write(dict(errcode=RET.SERVERERR, errmsg=RMS.SERVERERR))
        else:
            self.write(dict(errcode=RET.OK, errmsg=RMS.OK, data=bt_treeid))

    @gen.coroutine
    def put(self):
        try:
            c1 = copy.deepcopy(self.args)
            treeid = c1.pop('bt_treeid', None)
            if treeid:
                ret = yield Requestcmd.update(
                    'base_tree', dict(bt_treeid=treeid), c1)
            else:
                self.write(dict(errcode=RET.PARAMERR, errmsg=RMS.PARAMERR))
        except Exception as e:
            self.write(dict(errcode=RET.SERVERERR, errmsg=RMS.SERVERERR))
        else:
            self.write(dict(errcode=RET.OK, errmsg=RMS.OK, data=ret))


class BaseCode(BaseHandler):
    @gen.coroutine
    def get(self):
        c1 = self.args if self.args else {}
        if c1.get('bc_treeid'):
            sql = 'SELECT bc_id,bc_treeid,bc_name,bc_remark,bc_createtime,\
                    (SELECT cu_username FROM comp_sysuer WHERE a.bc_createuid = cu_userid) AS bc_createmen\
                    FROM base_code AS a WHERE bc_treeid=%(bc_treeid)s'
            ret = yield db.fetchall(sql, c1)
            self.write(dict(errcode=RET.OK, errmsg=RMS.OK,
                            data=json.loads(json.dumps(ret, cls=MyEncoder))))
        else:
            self.write(dict(errcode=RET.PARAMERR, errmsg=RMS.PARAMERR))

    @gen.coroutine
    def post(self):
        try:
            c1 = copy.deepcopy(self.args)
            bc_id = uuid.uuid4().hex
            c1.setdefault('bc_id', bc_id)
            userinfo = Session(self)
            bc_createuid = userinfo.data.get('uid')
            c1.setdefault('bc_createuid', bc_createuid)
            yield Requestcmd.insert('base_code', c1)
        except Exception as e:
            self.write(dict(errcode=RET.SERVERERR, errmsg=RMS.SERVERERR))
        else:
            self.write(dict(errcode=RET.OK, errmsg=RMS.OK, data=dict(
                bc_id=bc_id, bc_createmen=userinfo.data.get('username'))))

    @gen.coroutine
    def put(self):
        try:
            c1 = copy.deepcopy(self.args)
            bc_id = c1.pop('bc_id', None)
            if bc_id:
                ret = yield Requestcmd.update(
                    'base_code', dict(bc_id=bc_id), c1)
            else:
                self.write(dict(errcode=RET.PARAMERR, errmsg=RMS.PARAMERR))
        except Exception as e:
            self.write(dict(errcode=RET.SERVERERR, errmsg=RMS.SERVERERR))
        else:
            self.write(dict(errcode=RET.OK, errmsg=RMS.OK, data=ret))

    @gen.coroutine
    def delete(self):
        try:
            bc_id = self.args.get('bc_id')
            if bc_id:
                userinfo = Session(self)
                uid = userinfo.data.get('uid')
                if uid == '627263a4feba11e8bab15254005c9e8b':
                    ret = yield Requestcmd.del4and('base_code', self.args)
                else:
                    self.write(dict(errcode=RET.ROLEERR, errmsg=RMS.ROLEERR))
            else:
                self.write(dict(errcode=RET.PARAMERR, errmsg=RMS.PARAMERR))
        except Exception as e:
            self.write(dict(errcode=RET.SERVERERR, errmsg=RMS.SERVERERR))
        else:
            self.write(dict(errcode=RET.OK, errmsg=RMS.OK, data=ret))
