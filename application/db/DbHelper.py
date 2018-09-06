# coding:utf-8
__author__ = 'BLUE'

import config
import MysqlHelper

class DbHelper(MssqlHelper.SQLServer):
    def __init__(self):
        super(DbHelper, self).__init__(**config.database_options)
