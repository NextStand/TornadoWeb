# coding:utf-8
from application.db.MySQLHelper import db


class Daltest():
    @staticmethod
    def test():
        return db.callproc('ins_area_proc',args=(1,22))
