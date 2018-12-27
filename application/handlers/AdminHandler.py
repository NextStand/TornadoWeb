# coding:utf-8
__author__ = 'BLUE'
__time__ = 'Sat Dec 15 2018 23:00:29 GMT+0800'

import uuid
import copy
import json
import datetime
from tornado import gen
from application.base.BaseHandler import BaseHandler
from application.db.MySQLHelper import db
from utils.Requestcmd import Requestcmd
from utils.res_code import RET, RMS
from utils.comm_tools import MyEncoder
from utils.WxToken import AccessToken
from utils.decorator import require_login
from Wechat.WechatBasic import WechatBasic


class PcTzList(BaseHandler):
    @gen.coroutine
    def get(self):
        c1 = copy.deepcopy(self.args) if self.args else {}
        pagesize = c1.pop('pagesize', 20)
        pageindex = c1.pop('pageindex', 1)
        dbc = c1.pop('dbc', None)
        key1 = c1.pop('key1', '')
        ret = yield db.callproc('api_tz_list', (key1, pageindex, pagesize))
        result = dict(errcode=RET.OK, errmsg=RMS.OK,
                      data=json.loads(json.dumps(ret, cls=MyEncoder)))
        if dbc == 'yes':
            sql = 'select count(id) as _count from busi_tzcord'
            if key1 != '':
                sql += ' where t_tel like %(key)s or t_tzcode like %(key)s'
            count = yield db.fetchall(sql, dict(key=key1))
            result.setdefault('datacount', count[0].get('_count'))
        self.write(result)

    @gen.coroutine
    def put(self):
        c1 = copy.deepcopy(self.args) if self.args else {}
        uid = c1.pop('t_uid', None)
        mul = c1.pop('t_mul', None)
        if uid and mul:
            Requestcmd.update('busi_tzcord', dict(t_uid=uid), dict(t_mul=mul))
            self.write(dict(errcode=RET.OK, errmsg=RMS.OK))
        else:
            self.write(dict(errcode=RET.PARAMERR, errmsg=RMS.PARAMERR))

    @gen.coroutine
    def post(self):
        t_uid = uuid.uuid4().hex
        c1 = copy.deepcopy(self.args)
        c1.setdefault('t_uid', t_uid)
        c1.setdefault('t_from', 1)
        try:
            yield Requestcmd.insert('busi_tzcord',c1)
        except Exception as e:
            self.write(dict(errcode=RET.SERVERERR, errmsg=RMS.SERVERERR,data=str(e)))
        else:
            self.write(dict(errcode=RET.OK, errmsg=RMS.OK,data=t_uid))

class PcTzOpen(BaseHandler):
    @gen.coroutine
    def get(self):
        try:
            sql='SELECT b_code FROM busi_open ORDER BY id DESC LIMIT 1'
            ret = yield db.fetchone(sql)
        except Exception as e:
            self.write(dict(errcode=RET.SERVERERR, errmsg=RMS.SERVERERR,data=str(e)))
        else:
            self.write(dict(errcode=RET.OK, errmsg=RMS.OK,data=ret))

    @gen.coroutine
    def post(self):
        c1 = copy.deepcopy(self.args)
        b_id = uuid.uuid4().hex
        c1.setdefault('b_id', b_id)
        try:
            yield Requestcmd.insert('busi_open',c1)
        except Exception as e:
            self.write(dict(errcode=RET.SERVERERR, errmsg=RMS.SERVERERR,data=str(e)))
        else:
            self.write(dict(errcode=RET.OK, errmsg=RMS.OK,data=b_id))


class PcTzOpenList(BaseHandler):
    @gen.coroutine
    def get(self):
        try:
            sql='SELECT t_name,t_tel,t_carid,t_tzcode,a.t_createtime,b.t_createtime AS t_activetime,t_mul,t_from FROM busi_tzcord AS a INNER JOIN busi_tzflow AS b ON a.t_uid=b.t_codeid AND t_state=1';
            ret = yield db.fetchall(sql)
        except Exception as e:
            self.write(dict(errcode=RET.SERVERERR, errmsg=RMS.SERVERERR,data=str(e)))
        else:
            self.write(dict(errcode=RET.OK, errmsg=RMS.OK,
                            data=json.loads(json.dumps(ret, cls=MyEncoder))))