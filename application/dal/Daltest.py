# coding:utf-8
from application.db.MySQLHelper import MySQLHelper


class __Daltest(MySQLHelper):
    def test(self):
        return self.executemany('insert into ih_area_info(ai_name) values(%(name)s)',args=[{'name':'成华区'},{'name':'武侯区'}])


Daltest = __Daltest()
