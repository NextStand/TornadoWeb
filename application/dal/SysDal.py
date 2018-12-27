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
        sql = 'SELECT cu_userid,cu_usercode,cu_username,cu_avator,cu_state,\
                (SELECT ru_roleid FROM sys_roleuser WHERE ru_userid=cu_userid) AS u_roleid\
                FROM comp_sysuer WHERE cu_usercode=%s AND cu_password=%s AND cu_state=0'
        return db.fetchone(sql, args=(uid, pwd))
