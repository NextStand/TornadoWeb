# coding:utf-8
import tornado
import json

from application.base.BaseHandler import BaseHandler
from application.business.BusinessTest import BusinessTest


class IndexHandler(BaseHandler):
    @tornado.gen.coroutine
    def get(self):
        ret = yield BusinessTest.test()
        ret={'data':str(ret)}
        self.write(ret)
