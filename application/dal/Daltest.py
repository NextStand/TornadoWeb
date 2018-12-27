# coding:utf-8
from tornado import gen
from application.db.MySQLHelper import db


class Daltest(object):
    @staticmethod
    def test():
        aa = u'测试菜单'
        print "select * from sys_menu where  sm_caption='%s'" % aa
        return db.fetchall("select * from sys_menu where  sm_caption='%s'" % aa)

    @staticmethod
    @gen.coroutine
    def tt():
        yield gen.sleep(5)
        raise gen.Return('hello')
