# coding:utf-8
from application.handlers import MainHandler

urls_web = [
    (r'/', MainHandler.IndexHandler)
]
