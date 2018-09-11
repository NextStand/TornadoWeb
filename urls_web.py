# coding:utf-8
from application.handlers import MainHandler
from application.handlers import SysHandlers

urls_web = [
    (r'/', MainHandler.IndexHandler),
    (r'/upload', SysHandlers.UploadImageHandler),
    (r'/login', SysHandlers.LoginHandler),
]
