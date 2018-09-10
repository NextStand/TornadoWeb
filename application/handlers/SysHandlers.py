# coding:utf-8
__author__ = 'BLUE'
__time__ = '2018-09-07T01:44:55.741Z'

""" 
This handlers module is some handlers built in the system. 
Generally do not modify unless you need it very much.
"""
import os
import json

from application.base.BaseHandler import BaseHandler
from tornado.concurrent import run_on_executor
from concurrent.futures import ThreadPoolExecutor
from utils.session import Session


class LoginHandler(BaseHandler):
    def get(self):
        self.render('login.html')

    def post(self):
        next = self.get_argument("next", "/")
        # Login logic is placed here
        self.redirect(next)


class UploadImageHandler(BaseHandler):
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
