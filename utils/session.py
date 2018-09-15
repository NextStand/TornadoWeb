# coding:utf-8
__author__ = 'BLUE'

import uuid
import json
import logging

from constants import SESSION_EXPIRES_SECONDS, REQUEST_TIMEOUT


class Session(object):
    """ 
    session处理类，redis用于数据存储 
    """

    def __init__(self, request_handler):
        """ 
        :param request_handler:tornado.web.RequestHandler 请求句柄
        """
        self._request_handler = request_handler
        self.session_id = request_handler.get_secure_cookie('_BSSID')
        if not self.session_id:
            self.session_id = uuid.uuid4().hex
            self.data = {}
        else:
            json_data = None
            try:
                json_data = request_handler.redis.get(
                    "ssid_%s" % self.session_id)
            except Exception as e:
                logging.error(e)
            if not json_data:
                self.data = {}
            else:
                self.data = json.loads(json_data)

    def save(self):
        """ 
        保存session中的信息 
        """
        json_data = json.dumps(self.data)
        try:
            self._request_handler.set_secure_cookie(
                "_BSSID", self.session_id, expires_days=SESSION_EXPIRES_SECONDS/(3600*24))
            self._request_handler.redis.setex(
                'ssid_%s' % self.session_id, SESSION_EXPIRES_SECONDS + REQUEST_TIMEOUT, json_data)
        except Exception as e:
            logging.error(e)
            raise e

    def clear(self):
        """ 
        清空session
        """
        try:
            self._request_handler.redis.delete('ssid_%s' % self.session_id)
            self.data = {}
        except Exception as e:
            logging.error(e)
        self._request_handler.clear_cookie("_BSSID")
