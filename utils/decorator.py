# conding:utf-8
__author__ = 'BLUE'
__time__ = '2018-09-07T01:25:07.917Z'

""" 
该模块是一个装饰器模块，集中记录一些工具装饰器 
"""
import functools


def require_login(fun):
    """ 
    用于验证用户是否登录,开发者自己调用
    """
    @functools.wraps(fun)
    def wrapper(RequestHandler, *args, **kwargs):
        if not RequestHandler.get_current_user():
            return False
        else:
            fun(RequestHandler, *args, **kwargs)
    return wrapper
