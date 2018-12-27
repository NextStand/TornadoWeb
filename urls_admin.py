# coding:utf-8
import os

from application.base import BaseHandler

urls_admin = [
    (r"/upload/(.*)", BaseHandler.StaticFileBaseHandler,dict(path=os.path.join(os.path.dirname(__file__), "upload"))),
    (r".*", BaseHandler.BaseHandler)
]
