# coding:utf-8
__author__ = 'BLUE'

import json

from tornado.web import RequestHandler, StaticFileHandler
# from utils.session import Session


class BaseHandler(RequestHandler):
    """自定义基类"""
    @property
    def db(self):
        """作为RequestHandler对象的db属性"""
        return self.application.db

    @property
    def redis(self):
        """作为RequestHandler对象的redis属性"""
        return self.application.redis

    def prepare(self):
        # 设置token
        self.xsrf_token
        # 预解析json数据
        if self.request.headers.get("Content-Type", "").startswith("application/json"):
            self.json_args = json.loads(self.request.body)
        else:
            self.json_args = {}

    def set_default_headers(self):
        """设置默认json格式"""
        # self.set_header("Content-Type", "application/json; charset=UTF-8")
        pass

    def get_current_user(self):
        """判断用户是否登录"""
        # self.session = Session(self)
        # return self.session.data
        pass

    def on_finish(self):
        pass


class StaticFileBaseHandler(StaticFileHandler):
    """自定义静态文件处理类, 在用户获取html页面的时候设置_xsrf的cookie"""

    def __init__(self, *args, **kwargs):
        super(StaticFileBaseHandler, self).__init__(*args, **kwargs)
        self.xsrf_token
