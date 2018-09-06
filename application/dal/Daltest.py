# coding:utf-8
from application.db.MySQLHelper import MySQLHelper


class __Daltest(MySQLHelper):
    def test(self):
        return self.fetchall('select * from ih_area_info where ai_area_id >= 3870;')


Daltest = __Daltest()
