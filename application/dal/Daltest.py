# coding:utf-8
from tornado import gen
from application.db.MySQLHelper import db


class Daltest(object):
    @staticmethod
    def test():
        return db.fetchall('SELECT * FROM sys_menu')
