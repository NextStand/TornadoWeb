# coding:utf-8
__author__ = 'BLUE'
__time__ = '2018-09-10T01:24:56.709Z'

import logging
import config
import tormysql

from tormysql import DictCursor
from tornado import gen


class MySQLHelper(object):
    """
    MySQL database operation class, this is a single case.
    All methods are asynchronous.
    """
    __instance = None

    def __init__(self):
        super(MySQLHelper, self).__init__()
        self.pool = tormysql.ConnectionPool(
            max_connections=150,
            idle_seconds=7200,
            wait_connection_timeout=3,
            charset="utf8",
            **config.database_options
        )

    def __new__(cls, *args, **kwargs):
        if cls.__instance == None:
            cls.__instance = object.__new__(cls, *args, **kwargs)
        return cls.__instance

    def __del__(self):
        ''' 析构'''
        yield self.pool.close()

    @gen.coroutine
    def fetchone(self, sql, args=None):
        """ 
        查询单个数据 
        :param sql:str 查询字符串
        :param args:tuple | list | dict 参数
        :retrun:dict 第一条数据集组成的字典
        """
        with (yield self.pool.Connection()) as conn:
            try:
                data = None
                with conn.cursor(cursor_cls=DictCursor) as cursor:
                    yield cursor.execute(sql, args)
                    data = cursor.fetchone()
            except Exception as e:
                logging.error("fetchone error: %s" % e.args)
            else:
                yield conn.commit()
            raise gen.Return(data)

    @gen.coroutine
    def fetchmany(self, sql, args=None, size=None):
        """
        查询结果集中的前几行 
        :param sql:str 查询字符串
        :param args:tuple | list | dict 参数
        :param size:int 指定返回的行数
        :return:list 结果集列表
        """
        with (yield self.pool.Connection()) as conn:
            try:
                data = None
                with conn.cursor(cursor_cls=DictCursor) as cursor:
                    yield cursor.execute(sql, args)
                    data = cursor.fetchmany(size)
            except Exception as e:
                logging.error("fetchmany error: %s" % e.args)
            else:
                yield conn.commit()
            raise gen.Return(data)

    @gen.coroutine
    def fetchall(self, sql, args=None):
        """
        查询数据集合 
        :param sql:str 查询字符串
        :param args:tuple | list | dict 参数
        :return:list 结果集列表
        """
        with(yield self.pool.Connection()) as conn:
            try:
                data = None
                with conn.cursor(cursor_cls=DictCursor) as cursor:
                    yield cursor.execute(sql, args)
                    data = cursor.fetchall()
            except Exception as e:
                logging.error("fetchall error: %s" % e.args)
            else:
                yield conn.commit()
            raise gen.Return(data)

    @gen.coroutine
    def execute(self, sql, args=None):
        """
        执行非查询语句 
        :param sql:str sql语句
        :param args:tuple | list | dict 参数
        :return:int 受影响行数
        """
        with (yield self.pool.Connection()) as conn:
            try:
                ret = None
                with conn.cursor(cursor_cls=DictCursor) as cursor:
                    ret = yield cursor.execute(sql, args)
            except Exception as e:
                logging.error("execute error: %s" % e.args)
                yield conn.rollback()
            else:
                yield conn.commit()
        raise gen.Return(ret)

    @gen.coroutine
    def executemany(self, sql, args=None):
        """
        批量参数执行非查询语句 
        :param sql:str sql语句
        :param args: list[tuple()|dict()] | tuple(tuple()) 参数
        :return:int 受影响行数
        """
        with (yield self.pool.Connection()) as conn:
            try:
                ret = None
                with conn.cursor(cursor_cls=DictCursor) as cursor:
                    ret = yield cursor.executemany(sql, args)
            except Exception as e:
                logging.error("executemany error: %s" % e.args)
                yield conn.rollback()
            else:
                yield conn.commit()
        raise gen.Return(ret)

    @gen.coroutine
    def addbackid(self, sql, args=None):
        """ 
        新增一条数据并返回主键值 
        :param sql:str sql语句
        :param args:tuple | list | dict 参数
        :return:int | str 新增数据对象的主键值
        """
        with (yield self.pool.Connection()) as conn:
            try:
                ret = None
                with conn.cursor(cursor_cls=DictCursor) as cursor:
                    yield cursor.execute(sql, args)
                    ret = cursor.lastrowid
            except Exception as e:
                logging.error("addbackid error: %s" % e.args)
                yield conn.rollback()
            else:
                yield conn.commit()
            raise gen.Return(ret)

    @gen.coroutine
    def callproc(self, procname, args=()):
        """ 
        执行存储过程 
        :param procname:str 存储过程名称
        :param args:tuple | list  参数序列
        :return:list 结果列表集
        """
        with (yield self.pool.Connection()) as conn:
            try:
                ret = None
                with conn.cursor(cursor_cls=DictCursor) as cursor:
                    yield cursor.callproc(procname, args)
                    ret = cursor.fetchall()
                    # nextset一定要调用，鬼知道我在这儿经历了什么，儿豁你嘛
                    yield cursor.nextset()
            except Exception as e:
                logging.error("callproc error:---%s\n %s" % (procname, e.args))
                yield conn.rollback()
            else:
                yield conn.commit()
            raise gen.Return(ret)


db = MySQLHelper()
