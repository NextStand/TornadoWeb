# coding:utf-8
__author__ = 'BLUE'
__time__ = '2018-09-07T01:44:55.741Z'

""" 
This handlers module is some handlers built in the system. 
Generally do not modify unless you need it very much.
"""
import os
import json
import hashlib
import config
import uuid

from application.base.BaseHandler import BaseHandler
from tornado import gen
from tornado.concurrent import run_on_executor
from concurrent.futures import ThreadPoolExecutor
from utils.session import Session
from constants import SESSION_EXPIRES_SECONDS
from application.dal.SysDal import SysDal


class LoginHandler(BaseHandler):
    def get(self):
        # 写回一个加密key
        self.render('login.html')

    @gen.coroutine
    def post(self):
        next = self.get_argument("next", "/")
        username = self.get_argument('username')
        password = self.get_argument('password')
        if all((username, password)):
            m = hashlib.md5()
            password = '%s%s' % (password, config.passwd_hash_key)
            m.update(password.encode('utf8'))
            password = m.hexdigest().upper()
            ret = yield SysDal.login(username, password)
            if ret:
                # 登录成功
                session = Session(self)
                authorization = uuid.uuid4().hex
                session.data['authorization'] = authorization
                session.data['uid'] = ret.get('u_uid')
                session.data['username'] = ret.get('u_username')
                session.data['roleid'] = ret.get(
                    'u_roleid') if ret.get('u_roleid') else '000000'
                session.save()
                self.set_cookie('_BUUID', ret.get('u_uid'),
                                expires_days=SESSION_EXPIRES_SECONDS/(3600*24))
                self.set_cookie('_BAUTH', authorization,
                                expires_days=SESSION_EXPIRES_SECONDS/(3600*24))
                self.write('hello')
                # self.redirect(next)
            else:
                # 登录失败
                pass
        else:
            pass
        # Login logic is placed here


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
