# coding:utf-8
from application.dal.Daltest import Daltest


class BusinessTest(object):
    @classmethod
    def test(cls):
        return Daltest.test()
