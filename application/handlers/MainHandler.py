# coding:utf-8
import tornado
import json

from tornado import gen
from application.base.BaseHandler import BaseHandler
from application.business.BusinessTest import BusinessTest
from utils.session import Session
from utils.SendSMS import cpp
from libs.captcha.captcha import captcha


class IndexHandler(BaseHandler):
    @gen.coroutine
    def get(self):
        ret = yield BusinessTest.test()
        if ret:
            self.write(str(ret))
        else:
            self.send_error(500, msg='数据库出错了')

    @gen.coroutine
    def post(self):
        ret = yield BusinessTest.test()
        self.write(str(ret))

    def delete(self):
        print self.request.arguments
        a = self.get_argument('a', 'aaa')
        self.write(a)
