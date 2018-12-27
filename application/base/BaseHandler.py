# coding:utf-8
__author__ = 'BLUE'

import json
import os
import uuid

from tornado.web import RequestHandler, StaticFileHandler
from utils.session import Session
from utils.decorator import checktoken
from utils.res_code import RET, RMS
from utils.comm_tools import storage
from concurrent.futures import ThreadPoolExecutor


class BaseHandler(RequestHandler):
    @property
    def args(self):
        return self.__cargs

    def get(self):
        self.send_error(404, msg='这是哪儿，我走丢了')
    """
    自定义请求句柄基类
    """
    @property
    def redis(self):
        """
        作为RequestHandler对象的redis属性
        """
        return self.application.redis

    @checktoken
    def prepare(self, cargs):
        """
        请求预处理
        """
        self.__cargs = cargs  # 客户端参数，只读属性，dict
        self.xsrf_token
        if self.request.headers.get("Content-Type", "").startswith("application/json"):
            self.json_args = json.loads(self.request.body)
        else:
            self.json_args = {}

    def write_error(self, status_code, msg='我犯错了', ** kwargs):
        self.render('error.html', status_code=status_code, msg=msg)

    def set_default_headers(self):
        """
        设置默认json格式
        """
        # self.set_header("Content-Type", "application/json; charset=UTF-8")
        pass

    def get_current_user(self):
        """
        @tornado.web.authenticated装饰器调用，用于用户验证
        """
        self.session = Session(self)
        return self.session.data

    def on_finish(self):
        pass


class StaticFileBaseHandler(StaticFileHandler):
    """
    自定义静态文件处理类, 在用户获取html页面的时候设置_xsrf的cookie
    """

    def __init__(self, *args, **kwargs):
        super(StaticFileBaseHandler, self).__init__(*args, **kwargs)
        self.xsrf_token


class Xsrf(RequestHandler):
    def get(self):
        self.xsrf_token
        self.write(dict(errcode=RET.OK, errmsg=RMS.OK))


class Uploadpic(RequestHandler):
    def get(self):
        try:
            token = storage()
            self.write(dict(errcode=RET.OK, errmsg=RMS.OK, data=token))
        except Exception as e:
            self.write(dict(errcode=RET.THIRDERR, errmsg=u'token获取失败'))
