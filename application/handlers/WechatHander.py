# coding:utf-8
import time
import json
import hashlib
import copy
import re
import string
import random

from tornado import gen
from tornado.web import RequestHandler
from tornado.httpclient import AsyncHTTPClient, HTTPRequest
from Wechat.WechatBasic import WechatBasic
from utils.Requestcmd import Requestcmd
from application.base.BaseHandler import BaseHandler
from utils.res_code import RET, RMS
from Wechat.Exceptions import WechatAPIException
from utils.WxToken import AccessToken
from constants import WECHAT_TOKEN, WECHAT_APP_ID, WECHAT_APP_SECRET


class Handler4Wechat(RequestHandler):
    """ 处理微信服务器发过来的数据 """

    def txttrans(self, text):
        try:
            text = unicode(text, "utf-8")
        except TypeError as e:
            pass
        try:
            highpoints = re.compile(u'[\U00010000-\U0010ffff]')
        except re.error:
            highpoints = re.compile(u'[\uD800-\uDBFF][\uDC00-\uDFFF]')
        return highpoints.sub(u'', text)

    def prepare(self):
        signature = self.get_argument("signature")
        timestamp = self.get_argument("timestamp")
        nonce = self.get_argument("nonce")
        tmp = [WECHAT_TOKEN, timestamp, nonce]
        tmp.sort()
        tmp = "".join(tmp)
        real_signature = hashlib.sha1(tmp).hexdigest()
        if signature != real_signature:
            self.send_error(403)

    def get(self):
        echostr = self.get_argument("echostr")
        self.write(echostr)

    @gen.coroutine
    def post(self):
        try:
            access = yield AccessToken.get_access_token()
        except Exception as e:
            self.write("")
        else:
            xml_data = self.request.body
            wechat = WechatBasic(access_token=access.get(
                'access_token'), access_token_expires_at=access.get('expires_at'))
            wechat.parse_data(xml_data)
            message = wechat.get_message()
            response = None
            if message.type == 'subscribe':
                response = wechat.response_text(u'欢迎你')
            else:
                response = wechat.response_text(u'你好呀，我还不能回答你')
            self.write(response)


class Handler4Web(BaseHandler):
    """ 需要和微信服务器交互的web服务部分 """
    @gen.coroutine
    def get(self):
        c1 = copy.deepcopy(self.args)
        # sign标记要交互的内容
        sign = c1.pop('sign', None)
        if sign:
            try:
                wechat=None
                if sign == 'userinfo':
                    # 通过code换取用户基本信息
                    code = c1.pop('code', None)
                    if code:
                        wechat = WechatBasic(
                            appid=WECHAT_APP_ID, appsecret=WECHAT_APP_SECRET)
                        ret1 = yield wechat.getTokenByCode(code)
                        openid = ret1.get('openid')
                        # ret2 = yield wechat.getUserInfoByOAuth(access_token, openid)
                        self.write(
                            dict(errcode=RET.OK, errmsg=RMS.OK, data=openid))
                    else:
                        self.write(
                            dict(errcode=RET.PARAMERR, errmsg=RMS.PARAMERR))

                elif sign == 'jsconfig':
                    # 获取config需要的参数
                    url = c1.get('url', None)
                    if url:
                        try:
                            access = yield AccessToken.get_access_token()
                        except Exception as e:
                            self.write(
                                dict(errcode=RET.THIRDERR, errmsg=u'access_token获取失败',))
                        else:
                            wechat = WechatBasic(access_token=access.get(
                                'access_token'), access_token_expires_at=access.get('expires_at'))
                            ret1 = None
                            json_data = self.redis.get('jsticket')
                            if json_data:
                                ret1 = json.loads(json_data)
                            else:
                                ret1 = yield wechat.get_jsapi_ticket()
                                self.redis.setex('jsticket', ret1.get(
                                    'expires_in'), json.dumps(ret1))
                            timestamp = str(int(time.time()))
                            nonce_str = self.nonce_str()
                            jsticket = ret1.get('ticket')

                            result = dict(
                                appId=WECHAT_APP_ID,
                                timestamp=timestamp,
                                nonceStr=nonce_str,
                                signature=wechat.generate_jsapi_signature(
                                    timestamp, nonce_str, url, jsticket)
                            )
                            self.write(
                                dict(errcode=RET.OK, errmsg=RMS.OK, data=result))
                    else:
                        self.write(
                            dict(errcode=RET.PARAMERR, errmsg=RMS.PARAMERR))
            except WechatAPIException as e:
                self.write(dict(errcode=e.errcode, errmsg=e.errmsg))
            finally:
                del wechat
        else:
            self.write(dict(errcode=RET.PARAMERR, errmsg=RMS.PARAMERR))

    def nonce_str(self,length=32):
        """ 生成随机32位字符串，用于签名 """
        char = string.ascii_letters+string.digits
        return "".join(random.choice(char) for _ in range(length))


class MenuHandler(RequestHandler):
    @gen.coroutine
    def get(self):
        try:
            access = yield AccessToken.get_access_token()
        except Exception as e:
            self.write("errmsg: %s" % e)
        else:
            client = AsyncHTTPClient()
            url = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=%s" % access.get(
                'access_token')
            menu = {
                "button": [
                    {
                        "name": u"投注入口",
						"type":"view",
						"url":"http://dftp.ystsj.net/tz/wx#/activityintro"
                    },
                    {
                        "name": "工作入口",
						"type":"view",
						"url": "http://dftp.ystsj.net/tz/wx#/login"
                    }
                ]
            }
            req = HTTPRequest(
                url=url,
                method="POST",
                body=json.dumps(menu, ensure_ascii=False)
            )
            resp = yield client.fetch(req)
            dict_data = json.loads(resp.body)
            if dict_data["errcode"] == 0:
                self.write("OK")
            else:
                self.write("failed")


class Auth(RequestHandler):
    def get(self):
        self.render('MP_verify_w2f7amDJ10IXldcm.txt')
