# coding:utf-8
__author__ = 'BLUE'
__time__ = '2018-09-07T01:44:55.741Z'

""" 
This handlers module is some handlers built in the system. 
Generally do not modify unless you need it very much.
"""
import os
import json
import copy
import hashlib
import config
import uuid

from application.base.BaseHandler import BaseHandler
from tornado import gen
from tornado.concurrent import run_on_executor
from concurrent.futures import ThreadPoolExecutor
from utils.session import Session
from utils.res_code import RET, RMS
from constants import SESSION_EXPIRES_SECONDS
from application.dal.SysDal import SysDal
from application.db.MySQLHelper import db
from utils.Requestcmd import Requestcmd
from utils.comm_tools import MyEncoder


class Passport(BaseHandler):
    def get(self):
        # 写回一个加密key
        self.render('login.html')

    @gen.coroutine
    def post(self):
        next = self.get_argument("next", "/")
        username = self.args.get('username')
        password = self.args.get('password')
        if all((username, password)):
            m = hashlib.md5()
            password = '%s%s' % (password, config.passwd_hash_key)
            m.update(password.encode('utf8'))
            password = m.hexdigest().upper()
            ret = yield SysDal.login(username, password)
            if ret:
                # 登录成功
                session = Session(self, sessionid=ret.get('cu_userid'))
                authorization = uuid.uuid4().hex
                session.data['authorization'] = authorization
                session.data['uid'] = ret.get('cu_userid')
                session.data['username'] = ret.get('cu_username')
                session.data['roleid'] = ret.get(
                    'u_roleid') if ret.get('u_roleid') else '000000'
                session.save()
                self.set_cookie('_BUUID', ret.get('cu_userid'),
                                expires_days=SESSION_EXPIRES_SECONDS/(3600*24))
                self.set_cookie('_BAUTH', authorization,
                                expires_days=SESSION_EXPIRES_SECONDS/(3600*24))
                self.write(dict(errcode=RET.OK, errmsg=RMS.OK, data=ret))
                # self.redirect(next)
            else:
                # 登录失败
                self.write(dict(errcode=RET.LOGINERR, errmsg=RMS.LOGINERR))
        else:
            pass
        # Login logic is placed here

    def delete(self):
        session = Session(self)
        session.clear()
        self.clear_all_cookies()
        self.write(dict(errcode=RET.OK, errmsg=RMS.OK))

    @gen.coroutine
    def put(self):
        c1 = copy.deepcopy(self.args)
        spwd = c1.pop('spwd', None)
        npwd = c1.pop('npwd', None)
        if all((spwd, npwd)):
            userinfo = Session(self)
            username = userinfo.data.get('username')
            spwdhex = hashlib.md5(
                spwd+config.passwd_hash_key).hexdigest().upper()
            npwdhex = hashlib.md5(
                npwd+config.passwd_hash_key).hexdigest().upper()
            sql = 'UPDATE comp_sysuer SET cu_password=%s WHERE cu_username=%s AND cu_password=%s'
            ret = yield db.execute(sql, (npwdhex, username, spwdhex))
            if ret > 0:
                self.write(dict(errcode=RET.OK, errmsg=RMS.OK, data=ret))
            else:
                self.write(dict(errcode=RET.ROLEERR, errmsg=[u'用户原密码错误']))
        else:
            self.write(dict(errcode=RET.PARAMERR, errmsg=RMS.PARAMERR))


class UploadImageHandler(BaseHandler):
    """
    图片上传 图片文件name=image
    """
    executor = ThreadPoolExecutor(10)

    @run_on_executor
    def post(self):
        file_metas = self.request.files["image"]
        dirname = self.get_argument('dict', default='attach')
        path = os.path.join(
            os.path.dirname(__file__), '../../upload', dirname)
        exit = os.path.exists(path)
        if not exit:
            os.makedirs(path)
        rets = []
        for meta in file_metas:
            file_name = meta['filename']
            file_path = os.path.join(path, file_name)
            with open(file_path, 'wb+') as up:
                up.write(meta['body'])
            rets.append('/upload/%s/%s' % (dirname, file_name))
        ret = {'status': True, 'path': rets}
        self.write(ret)


class BusiAttach(BaseHandler):
    @gen.coroutine
    def get(self):
        ret = yield Requestcmd.find4and('busi_attach', self.args)
        self.write(dict(errcode=RET.OK, errmsg=RMS.OK,
                        data=json.loads(json.dumps(ret, cls=MyEncoder))))

