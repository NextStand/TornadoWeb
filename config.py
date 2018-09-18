# coding:utf-8
__author__ = 'BLUE'
import os
# from application.base.BaseHandler import StaticFileBaseHandler
# Application config
settings = dict(
    static_path=os.path.join(os.path.dirname(__file__), "static"),
    template_path=os.path.join(os.path.dirname(__file__), "templates"),
    cookie_secret="FhLXI+BRRomtuaG47hoXEg3JCdi0BUi8vrpWmoxaoyI=",
    xsrf_cookies=True,
    debug=True,
    login_url='/login'
)


# Database configuration parameters
database_options = dict(
    host="192.168.0.175",
    db="db_tornado",
    user="root",
    password="hanmo"
)

# Redis config
redis_options = dict(
    host="192.168.0.175",
    port=6379
)

# logs config
log_path = os.path.join(os.path.dirname(__file__), "logs/log")
log_level = "debug"

# Cipher encryption key
passwd_hash_key = "BLUE"
