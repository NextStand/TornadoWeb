# coding:utf-8
__author__ = 'BLUE'
__time__ = '2018-09-12T06:09:47.269Z'
from application.db.MySQLHelper import db


class SysDal(object):
    @staticmethod
    def login(uid, pwd):
        """
        登录
        :param uid:str 用户名
        :param pwd:str 密码
        """
        sql = 'SELECT u_uid,u_username,\
                (SELECT ru_roleid FROM sys_roleuser WHERE ru_userid=u_uid) AS u_roleid\
                FROM sys_users WHERE u_username=%s AND u_password=%s'
        return db.fetchone(sql, args=(uid, pwd))
        pass
