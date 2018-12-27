# coding:utf-8
import time
import json
from tornado import gen
from tornado.web import RequestHandler
from tornado.httpclient import AsyncHTTPClient, HTTPRequest
from constants import WECHAT_APP_ID,WECHAT_APP_SECRET,WECHAT_TOKEN

class AccessToken(object):
    """access_token辅助类"""
    _access_token = None
    _create_time = 0
    _expires_in = 0

    @classmethod
    @gen.coroutine
    def update_access_token(cls):
        client = AsyncHTTPClient()
        url = "https://api.weixin.qq.com/cgi-bin/token?" \
            "grant_type=client_credential&appid=%s&secret=%s" % (
                WECHAT_APP_ID, WECHAT_APP_SECRET)
        resp = yield client.fetch(url)
        dict_data = json.loads(resp.body)
        if "errcode" in dict_data:
            raise Exception("wechat server error")
        else:
            cls._access_token = dict_data["access_token"]
            cls._expires_in = dict_data["expires_in"]
            cls._create_time = time.time()

    @classmethod
    @gen.coroutine
    def get_access_token(cls):
        if time.time() - cls._create_time > (cls._expires_in - 200):
            # 向微信服务器请求access_token
            yield cls.update_access_token()
            raise gen.Return(dict(access_token=cls._access_token,
                                  expires_at=cls._create_time+cls._expires_in))
        else:
            raise gen.Return(dict(access_token=cls._access_token,
                                  expires_at=cls._create_time+cls._expires_in))
