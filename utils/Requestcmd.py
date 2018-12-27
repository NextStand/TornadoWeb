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
    def find4and(cls, table, conditions, order=dict(id=1), page=None,field='*'):
        """
        and精确查找
        :param table:str 表名称
        :param conditions: dict 参数 default None
        :param order:dict 排序字段{field:1/-1} 1正序（默认id正序） -1倒序
        :param page:dict 分页dict(pageindex=1,pagesize=20)
        :return:future
        """
        # 参照以下模型
        # SELECT * FROM test INNER JOIN(SELECT id FROM test WHERE CompanyCode='5057' ORDER BY id DESC LIMIT 0,100) AS t1 ON t1.id=test.id
        sql =None
        cond=''
        orders=cls.__dict2order(order)
        if conditions:
            cond=' where %s ' % cls.dict2str_split(conditions, 'and')
        if page:
            pageindex = page.get('pageindex', 1) if page.get('pageindex', 1) > 0 else 1
            pagesize = page.get('pagesize', 20) if page.get('pagesize', 20) > 0 else 1
            offset = (int(pageindex)-1)* int(pagesize)
            sql='SELECT %(field)s FROM %(table)s AS a INNER JOIN(SELECT id FROM %(table)s %(cond)s ORDER BY %(orders)s LIMIT %(offset)s,%(pagesize)s) AS _ ON _.id=a.id'
            sql=sql%dict(field=field,table=table,cond=cond,orders=orders,offset=offset,pagesize=pagesize)
        else:
            sql='SELECT %(field)s FROM %(table)s %(cond)s ORDER BY %(orders)s'%dict(field=field,table=table,cond=cond,orders=orders)
        return db.fetchall(sql, conditions)

    @classmethod
    @chkparams
    def find4and2count(cls, table, conditions):
        """ 配合and精确查询数据总量 """
        return cls.find4and(table,conditions,field='count(id) as _count')

    @classmethod
    @chkparams
    def find4or(cls, table, conditions, order=dict(id=1), page=None,field='*'):
        """
        or精确查找
        :param table:str 表名称
        :param conditions: dict 参数 default None
        :param order:排序字段{field:1/-1} 1正序（默认id正序） -1倒序
        :param page:dict 分页dict(pageindex=1,pagesize=20)
        :return:future
        """
        sql =None
        cond=''
        orders=cls.__dict2order(order)
        if conditions:
            cond=' where %s ' % cls.dict2str_split(conditions, 'or')
        if page:
            pageindex = page.get('pageindex', 1) if page.get('pageindex', 1) > 0 else 1
            pagesize = page.get('pagesize', 20) if page.get('pagesize', 20) > 0 else 1
            offset = (int(pageindex)-1)* int(pagesize)
            sql='SELECT %(field)s FROM %(table)s AS a INNER JOIN(SELECT id FROM %(table)s %(cond)s ORDER BY %(orders)s LIMIT %(offset)s,%(pagesize)s) AS _ ON _.id=a.id'
            sql=sql%dict(field=field,table=table,cond=cond,orders=orders,offset=offset,pagesize=pagesize)
        else:
            sql='SELECT %(field)s FROM %(table)s %(cond)s ORDER BY %(orders)s'%dict(field=field,table=table,cond=cond,orders=orders)
        return db.fetchall(sql, conditions)

    @classmethod
    @chkparams
    def find4or2count(cls, table, conditions):
        """ 配合or精确查询数据总量 """
        return cls.find4or(table,conditions,field='count(id) as _count')

    @classmethod
    @chkparams
    def f4likeor(cls, table, conditions, order=dict(id=1), page=None,field='*'):
        """ or模糊查找 """
        return cls.__sltcmd_like(table, conditions, order, page,'OR',field)

    @classmethod
    @chkparams
    def f4likeor2count(cls, table, conditions):
        """ 配合or模糊查询数据总量 """
        return cls.f4likeor(table,conditions,field='count(id) as _count')

    @classmethod
    @chkparams
    def f4likeand(cls, table, conditions, order=dict(id=1), page=None,field='*'):
        """ and模糊查找 """
        return cls.__sltcmd_like(table, conditions, order, page,'AND',field)
    
    @classmethod
    @chkparams
    def f4likeand2count(cls, table, conditions):
        """ 配合and模糊查询数据总量 """
        return cls.f4likeand(table,conditions,field='count(id) as _count')

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
            conditions.pop('_.id',None)
            conditions.pop('id',None)
            ls = list(conditions)
            sql = 'INSERT INTO %s(' % table + ','.join(ls) + \
                ') VALUES (' + cls.dict2str_split(conditions, ',') + ');'
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
        :return:携带受影响行数的future
        """
        if setargs:
            setargs.pop('_.id',None)
            setargs.pop('id',None)
            sql = 'UPDATE %s SET ' % table
            tmplist = []
            for k, v in setargs.items():
                tmp = "%s=" % str(k)
                tmp += '%('+str(k)+r')s'
                tmplist.append(tmp)
            sql += ','.join(tmplist)
            if conditions:
                sql += ' where %s ' % cls.dict2str_split(conditions, 'and')
            conditions = conditions if conditions else {}
            return db.execute(sql, dict(setargs, **conditions))
        else:
            raise ValueError(':param setargs is not allowed to be empty.')

    @classmethod
    @chkparams
    def del4and(cls, table, conditions):
        """ and条件删除 """
        sql = 'delete from %s' % table
        sql += ' where %s ' % cls.dict2str_split(conditions, 'and')
        return db.execute(sql, conditions)

    @classmethod
    @chkparams
    def del4or(cls, table, conditions):
        """ or条件删除 """
        sql = 'delete from %s' % table
        sql += ' where %s ' % cls.dict2str_split(conditions, 'or')
        return db.execute(sql, conditions)

    @classmethod
    def __sltcmd_like(cls, table, conditions, order, page, symbol,field):
        sql =None
        cond=''
        orders=cls.__dict2order(order)
        c1 = None
        if conditions:
            c1 = copy.deepcopy(conditions)
            del conditions
            for k, v in c1.items():
                c1[k] = '%'+v+'%'
            cond=' where %s ' % cls.dict2like(c1, symbol)
        if page:
            pageindex = page.get('pageindex', 1) if page.get('pageindex', 1) > 0 else 1
            pagesize = page.get('pagesize', 20) if page.get('pagesize', 20) > 0 else 1
            offset = (int(pageindex)-1)* int(pagesize)
            sql='SELECT %(field)s FROM %(table)s AS a INNER JOIN(SELECT id FROM %(table)s %(cond)s ORDER BY %(orders)s LIMIT %(offset)s,%(pagesize)s) AS _ ON _.id=a.id'
            sql=sql%dict(field=field,table=table,cond=cond,orders=orders,offset=offset,pagesize=pagesize)
        else:
            sql='SELECT %(field)s FROM %(table)s %(cond)s ORDER BY %(orders)s'%dict(field=field,table=table,cond=cond,orders=orders)
        return db.fetchall(sql, c1)

    @staticmethod
    def dict2str_split(dictin, symbol):
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
    def dict2like(dictin, symbol):
        tmplist = []
        for k, v in dictin.items():
            tmp = "%s LIKE " % str(k)
            tmp += '%('+str(k)+r')s'
            tmplist.append(tmp)
        split = ' %s ' % symbol
        return split.join(tmplist)
