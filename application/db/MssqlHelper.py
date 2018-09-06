# coding:utf-8
__author__ = 'BLUE'
import pymssql




class SQLServer(object):
    def __init__(self, host, database, user, password, *args, **kwargs):
        self.__host = host
        self.__database = database
        self.__user = user
        self.__password = password
        self.__kwargs = kwargs

    def __GetConnect(self):
        '''获取数据库连接'''
        if not self.__database:
            raise(NameError, 'No database information was set.')
        self.conn = pymssql.connect(
            server=self.__host,
            user=self.__user,
            password=self.__password,
            database=self.__database,
            charset='UTF-8',
            port='1433',
            as_dict=True,
            **self.__kwargs
        )
        cursor = self.conn.cursor()
        if not cursor:
            raise(NameError, "Failed to connect to database")
        else:
            return cursor

    def ExecQuery(self, sql):
        '''
        执行查询语句
        返回一个包含tuple的list，list是元素的记录行，tuple记录每行的字段数值
        '''
        cur = self.__GetConnect()
        cur.execute(sql)
        result = cur.fetchall()
        self.conn.close()
        return result


def main():
    print pymssql.get_max_connections()


if __name__ == '__main__':
    main()
