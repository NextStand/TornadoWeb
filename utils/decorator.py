# coding:utf-8
__author__ = 'BLUE'
__time__ = '2018-09-07T01:25:07.917Z'

""" 
该模块是一个装饰器模块，集中记录一些工具装饰器 
"""
import functools
import json
import logging
import time
import hashlib
import re
from constants import REQUEST_TIMEOUT


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


def checktoken(fun):
    """
    用户请求令牌验证
    验证数据未被篡改
    验证请求合法
    """
    @functools.wraps(fun)
    @api_authority
    def wrapper(RequestHandler, *args, **kwargs):
        # 验证接口权限>>>>>>
        if RequestHandler.request.method == 'GET':
            fun(RequestHandler, *args, **kwargs)
        else:
            # 验证参数和时间戳
            client_timestamp = RequestHandler.get_argument(
                '_timestamp', default=None)
            client_authtoken = RequestHandler.get_argument(
                '_authtoken', default=None)
            if not all((client_timestamp, client_authtoken)):
                return RequestHandler.send_error(400)
            server_timestamp = int(time.time())
            try:
                diff_timestamp = server_timestamp-int(client_timestamp)
            except Exception as e:
                return RequestHandler.send_error(403)
            else:
                if diff_timestamp > REQUEST_TIMEOUT or diff_timestamp < 0:
                    return RequestHandler.send_error(403)
            # 为每个用户颁发的唯一id
            Authorization = None
            # 用户身份id
            Uid = None
            session_id = RequestHandler.get_secure_cookie('_BSSID')
            if not session_id:
                Authorization, Uid = ("000000", "000000")
            else:
                try:
                    sd = RequestHandler.redis.get("ssid_%s" % session_id)
                except Exception as e:
                    logging.error(e)
                else:
                    sd = json.loads(sd)
                    Authorization = sd.get('authorization', '000000')
                    Uid = sd.get('uid', '000000')
            # 进行加密匹配
            client_args = {}
            for k, v in RequestHandler.request.arguments.items():
                if k not in('_timestamp', '_authtoken'):
                    client_args[k] = v[-1]
            value_secert = ''.join([str(client_args[k])
                                    for k in sorted(client_args.keys())])
            decode_authtoken = '%s%s%s%s' % (
                Authorization, Uid, client_timestamp, value_secert)
            # MD5
            m = hashlib.md5()
            m.update(decode_authtoken.encode('utf8'))
            encode_authtoken = m.hexdigest().upper()
            # 验证token
            if encode_authtoken == client_authtoken:
                fun(RequestHandler, *args, **kwargs)
            else:
                return RequestHandler.send_error(403)
    return wrapper


def api_authority(fun):

    def wrapper(RequestHandler, *args, **kwargs):
        print re.match(r'^/dbopt/(?P<tb>\w+)$',RequestHandler.request.uri)
        return RequestHandler.send_error(403)
        fun(RequestHandler, *args, **kwargs)
    return wrapper
