# coding:utf-8
__author__ = 'BLUE'
__time__ = '2018-09-07T05:55:42.153Z'

""" 
SMS module, based on ‘云通讯’.
"""
import tornado.httpclient
import datetime
import hashlib
import base64
import json

from tornado import gen

class SendSMS(object):
    """ 
    短讯服务,
    This class is a singleton.  
    """
    __instance = None

    def __init__(self):
        self.__AccountSid = '8a216da8653147e601653dde3c8d081d'
        self.__AuthToken = 'e35f681fa62d4eda8e9e827ce067178e'
        self.__AppID = '8a216da8653147e601653dde3ce70824'
        self.__RestURL = 'https://app.cloopen.com:8883'

    def __new__(cls, *args, **kwargs):
        if cls.__instance == None:
            cls.__instance = object.__new__(cls, *args, **kwargs)
        return cls.__instance

    def __del__(self):
        self.__instance = None

    def __mkurl(self):
        """ 
        生成统一请求包头和HTTP标准包头
        :return:tuple (统一请求包头，HTTP标准包头)
        """
        m = hashlib.md5()
        timetemp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        decodeSig = '%s%s%s' % (self.__AccountSid, self.__AuthToken, timetemp)
        m.update(decodeSig.encode('utf8'))
        encodeSig = m.hexdigest().upper()
        url = '%s/2013-12-26/Accounts/%s/SMS/TemplateSMS?sig=%s' % (
            self.__RestURL, self.__AccountSid, encodeSig)
        head = self.__mkhead(timetemp)
        return url, head

    def __mkhead(self, timetemp):
        """
        生成HTTP标准包头
        :param timetemp:str 与统一请求包头一致的时间戳
        :return:dict HTTP标准包头
        """
        decodeAuthor = '%s:%s' % (self.__AccountSid, timetemp)
        encodeAuthor = base64.b64encode(decodeAuthor)
        head = {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=utf-8;',
            'Content-Length': 139,
            'Authorization': encodeAuthor}
        return head

    @tornado.gen.coroutine
    def sendSMS(self, to, datas, tempId='1'):
        """
        异步发送短讯息
        :param to:str 目标用户电话
        :param datas:list 依序填充模板的数据
        :param tempId:str 模板id
        """
        bodys = dict(to=to, appId=self.__AppID, datas=datas, templateId=tempId)
        url, headers = self.__mkurl()
        http = tornado.httpclient.AsyncHTTPClient()
        HttpRequest = tornado.httpclient.HTTPRequest(
            url=url,
            method='POST',
            headers=headers,
            body=str(bodys)
        )
        response = yield http.fetch(HttpRequest)
        rdata = json.loads(response.body)
        if rdata.get('statusCode') == '000000':
            raise gen.Return(True)
        else:
            raise gen.Return(False)


cpp = SendSMS()
if __name__ == '__main__':
    cpp = SendSMS()
    cpp.sendSMS()
