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
from config import database_options
from constants import REQUEST_TIMEOUT
from utils.res_code import RET, RMS
from application.db.MySQLHelper import db
from tornado import gen
from .comm_tools import tostr
from utils.session import Session


def require_login(fun):
    """ 
    用于验证用户是否登录,开发者自己调用
    """
    @functools.wraps(fun)
    def wrapper(RequestHandler, *args, **kwargs):
        if not RequestHandler.get_current_user():
            RequestHandler.write(dict(errcode=RET.SESSIONERR, errmsg=RMS.SESSIONERR))
        else:
            print fun
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
            client_args = {}
            for k, v in RequestHandler.request.arguments.items():
                if k not in('_timestamp', '_authtoken'):
                    client_args[k] = tostr(v[-1])
            fun(RequestHandler, client_args if client_args else None, *args, **kwargs)
        else:
            # 验证参数和时间戳
            client_timestamp = RequestHandler.get_argument(
                '_timestamp', default=None)
            client_authtoken = RequestHandler.get_argument(
                '_authtoken', default=None)
            if not all((client_timestamp, client_authtoken)):
                return RequestHandler.send_error(400, msg='服务器拒绝了你，原因：Token缺失')
            server_timestamp = int(time.time())
            try:
                diff_timestamp = server_timestamp-int(client_timestamp)
            except Exception as e:
                return RequestHandler.send_error(403, msg='服务器拒绝了你，原因：请求参数无效')
            else:
                if abs(diff_timestamp) > REQUEST_TIMEOUT:
                    return RequestHandler.send_error(403, msg='服务器拒绝了你，原因：请求超时')
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
                    try:
                        sd = json.loads(sd)
                    except Exception as e:
                        sd={}
                    Authorization = sd.get('authorization', '000000')
                    Uid = sd.get('uid', '000000')
            # 进行加密匹配
            client_args = {}
            for k, v in RequestHandler.request.arguments.items():
                if k not in('_timestamp', '_authtoken'):
                    client_args[k] = tostr(v[-1])
            value_secert = ''.join([str(client_args[k])
                                    for k in sorted(client_args.keys())])
            decode_authtoken = '%s%s%s%s' % (
                Authorization, Uid, client_timestamp, value_secert)
            # MD5
            m = hashlib.md5()
            m.update(decode_authtoken.encode('utf8'))
            encode_authtoken = m.hexdigest().upper()
            # 验证身份token
            if encode_authtoken == client_authtoken:
                fun(RequestHandler, client_args if client_args else None,
                    *args, **kwargs)
            else:
                return RequestHandler.send_error(403, msg='服务器拒绝了你，原因：身份令牌验证失败')
    return wrapper


def api_authority(fun):
    @gen.coroutine
    def wrapper(RequestHandler, *args, **kwargs):
        # 首选缓存中获取用户信息，没有的按照游客角色id“000000”处理
        roleid = '000000'
        session_data = Session(RequestHandler).data
        if session_data:
            roleid = session_data.get('roleid') if session_data.get(
                'roleid') else '000000'
        # 获取角色的接口
        roleapi = RequestHandler.redis.hget('roleapi_cache', roleid) #开发阶段屏蔽
        # roleapi = None
        if not roleapi:
            sql = 'SELECT (SELECT sa_uri FROM sys_api WHERE a.ra_apiid = sa_id) AS ra_uri, ra_get,ra_post,ra_put,ra_delete FROM sys_roleapi AS a WHERE ra_roleid=%s'
            ret = yield db.fetchall(sql, args=(roleid,))
            ret = json.dumps(ret)
            RequestHandler.redis.hset('roleapi_cache', roleid, ret)
            roleapi = ret
        # 接口权限
        roleapi = json.loads(roleapi)
        request_uri = RequestHandler.request.uri.split('?')[0]
        accordapi = None
        for api in roleapi:
            if re.match(r'^%s$' % api.get('ra_uri'), request_uri):
                accordapi = api
                break
        # 接口请求方式权限
        if accordapi:
            request_method = 'ra_%s' % RequestHandler.request.method.lower()
            rm_power = accordapi.get(request_method, 0)
            if str(rm_power) == '1':
                fun(RequestHandler, *args, **kwargs)
            else:
                RequestHandler.send_error(
                    403, msg='服务器拒绝了你，原因：%s无权访问或登录过期' % (RequestHandler.request.method))
                raise gen.Return()
        else:
            RequestHandler.send_error(403, msg='服务器拒绝了你，原因：无权访问或登录过期')
            raise gen.Return()
    return wrapper
