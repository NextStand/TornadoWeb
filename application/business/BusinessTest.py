# coding:utf-8
from tornado import gen
from application.dal.Daltest import Daltest


class BusinessTest(object):
    @staticmethod
    def test():
        return Daltest.test()
