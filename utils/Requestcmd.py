# coding:utf-8
import functools
import copy
from application.db.MySQLHelper import db


def chkparams(fun):
    """ 参数检查 """
    @functools.wraps(fun)
    def wrapper(cls, table, conditions=None, *args, **kwargs):
        if conditions:
            if not isinstance(conditions, dict):
                raise ValueError('conditions is must be a dict')
        return fun(cls, table, conditions, *args, **kwargs)
    return wrapper


class Requestcmd(object):
    """对一些常用的库操作进行封装"""
    @classmethod
    @chkparams
    def find4and(cls, table, conditions, order=None, page=None):
        """
        and精确查找
        :param table:str 表名称
        :param conditions: dict 参数 default None
        :param order:dict 排序字段{field:1/-1} 1正序（默认） -1倒序
        :param page:dict 分页dict(pageindex=1,pagesize=20)
        :return:future
        """
        sql = 'select * from %s' % table
        if conditions:
            sql += ' where %s ' % cls.__dict2str_split(conditions, 'and')
        if order:
            sql += ' order by %s' % cls.__dict2order(order)
        if page:
            pageindex = page.get('pageindex', 1) if page.get(
                'pageindex', 1) > 0 else 1
            pagesize = page.get('pagesize', 20) if page.get(
                'pagesize', 20) > 0 else 1
            sql += ' limit %s,%s' % ((pageindex-1)*pagesize, pagesize)
        return db.fetchall(sql, conditions)

    @classmethod
    @chkparams
    def find4or(cls, table, conditions, order=None, page=None):
        """
        or精确查找
        :param table:str 表名称
        :param conditions: dict 参数 default None
        :param order:dict 排序字段{field:1/-1} 1正序（默认） -1倒序
        :param page:dict 分页dict(pageindex=1,pagesize=20)
        :return:future
        """
        sql = 'select * from %s' % table
        if conditions:
            sql += ' where %s ' % cls.__dict2str_split(conditions, 'or')
        if order:
            sql += ' order by %s' % cls.__dict2order(order)
        if page:
            pageindex = page.get('pageindex', 1) if page.get(
                'pageindex', 1) > 0 else 1
            pagesize = page.get('pagesize', 20) if page.get(
                'pagesize', 20) > 0 else 1
            sql += ' limit %s,%s' % ((pageindex-1)*pagesize, pagesize)
        return db.fetchall(sql, conditions)

    @classmethod
    @chkparams
    def f4likeor(cls, table, conditions, order=None, page=None):
        """ or模糊查找 """
        return cls.__sltcmd_like(table, conditions, order, page, 'OR')

    @classmethod
    @chkparams
    def f4likeand(cls, table, conditions, order=None, page=None):
        """ and模糊查找 """
        return cls.__sltcmd_like(table, conditions, order, page, 'AND')

    @classmethod
    @chkparams
    def insert(cls, table, conditions):
        """
        插入数据
        :param table:str 表名称
        :param conditions: dict 参数
        :return:future
        """
        if conditions:
            ls = list(conditions)
            sql = 'INSERT INTO %s(' % table + ','.join(ls) + \
                ') VALUES (' + cls.__dict2str_split(conditions, ',') + ');'
            return db.addbackid(sql, conditions)
        else:
            raise ValueError(':param conditions is not allowed to be empty.')

    @classmethod
    @chkparams
    def update(cls, table, conditions, setargs):
        """
        更新数据，条件为空则更新所有，不解释
        :param table:str 表名称
        :param conditions: dict 条件参数
        :param setargs: dict 值参数
        :return:future
        """
        if setargs:
            sql = 'UPDATE %s SET ' % table
            tmplist = []
            for k, v in setargs.items():
                tmp = "%s=" % str(k)
                tmp += '%('+str(k)+r')s'
                tmplist.append(tmp)
            sql += ','.join(tmplist)
            if conditions:
                sql += ' where %s ' % cls.__dict2str_split(conditions, 'and')
            return db.execute(sql, dict(setargs, **conditions))
        else:
            raise ValueError(':param setargs is not allowed to be empty.')

    @classmethod
    @chkparams
    def del4and(cls, table, conditions):
        """ and条件删除 """
        sql = 'delete from %s' % table
        sql += ' where %s ' % cls.__dict2str_split(conditions, 'and')

    @classmethod
    @chkparams
    def del4or(cls, table, conditions):
        """ or条件删除 """
        sql = 'delete from %s' % table
        sql += ' where %s ' % cls.__dict2str_split(conditions, 'or')

    @classmethod
    def __sltcmd_like(cls, table, conditions, order, page, symbol):
        sql = 'select * from %s' % table
        c1 = None
        if conditions:
            c1 = copy.deepcopy(conditions)
            del conditions
            for k, v in c1.items():
                c1[k] = '%'+v+'%'
            sql += ' where %s ' % cls.__dict2like(c1, symbol)
        if order:
            sql += ' order by %s' % cls.__dict2order(order)
        if page:
            pageindex = page.get('pageindex', 1) if page.get(
                'pageindex', 1) > 0 else 1
            pagesize = page.get('pagesize', 20) if page.get(
                'pagesize', 20) > 0 else 1
            sql += ' limit %s,%s' % ((pageindex-1)*pagesize, pagesize)
        return db.fetchall(sql, c1)

    @staticmethod
    def __dict2str_split(dictin, symbol):
        '''
        将字典变成合适的分割形式，%(name)s
        :param dictin:dict 参数字典
        :param symbol:str 分隔符
        :return:str
        '''
        tmplist = []
        for k, v in dictin.items():
            tmp = ''
            if symbol in ('and', 'or'):
                tmp = "%s=" % str(k)
            tmp += '%('+str(k)+r')s'
            tmplist.append(tmp)
        split = ' %s ' % symbol
        return split.join(tmplist)

    @staticmethod
    def __dict2order(dictin):
        tmplist = []
        for k, v in dictin.items():
            tmp = ''
            if '1' == str(v):
                # 正序
                tmp += '%s ASC' % k
            else:
                tmp += '%s DESC' % k
            tmplist.append(tmp)
        return ','.join(tmplist)

    @staticmethod
    def __dict2like(dictin, symbol):
        tmplist = []
        for k, v in dictin.items():
            tmp = "%s LIKE " % str(k)
            tmp += '%('+str(k)+r')s'
            tmplist.append(tmp)
        split = ' %s ' % symbol
        return split.join(tmplist)
