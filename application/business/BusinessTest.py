# coding:utf-8
from tornado import gen
from application.dal.Daltest import Daltest
from utils.Requestcmd import Requestcmd


class BusinessTest(object):
    @staticmethod
    def test(req):
        # return Daltest.test()
        return Daltest.tt()
        # return Requestcmd.f4likeor('sys_menu', req.args)
