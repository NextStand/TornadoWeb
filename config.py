# coding:utf-8
__author__ = 'BLUE'
import os
# from application.base.BaseHandler import StaticFileBaseHandler
# Application config
settings = dict(
    static_path=os.path.join(os.path.dirname(__file__), "static"),
    template_path=os.path.join(os.path.dirname(__file__), "templates"),
    cookie_secret="FhLXI+BRRomtuaG47hoXEg3JCdi0BUi8vrpWmoxaoyI=",
    xsrf_cookies=False,
    debug=True,
    login_url='/login'
)


# Database configuration parameters
database_options = dict(
    host="94.191.13.239",
    db="db_luckdraw",
    user="LuckDraw",
    password="LuckDraw"
)

# Redis config
redis_options = dict(
    host="94.191.13.239",
    port=6379,
    password='LuckDraw'
)


# logs config
log_path = os.path.join(os.path.dirname(__file__), "logs/log")
log_level = "debug"

# Cipher encryption key
passwd_hash_key = "BLUE"
# 默认密码
passwd_default='123'
