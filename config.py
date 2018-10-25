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
    host="127.0.0.1",
    db="db_tornado",
    user="root",
    password="hanmo"
)

# Redis config
redis_options = dict(
    host="127.0.0.1",
    port=6379
)

# Email config
email_options = dict(
    smtpHost='smtp.163.com',    # smtp主机地址
    smtpPort='25',  # smtp端口
    sslPort='587',  # SSL连接端口，没有就不写
    username='18215676683@163.com', # 邮箱用户名
    password='helloworld123',   # 授权密码
    identity='地名公众服务信息平台' #单位名称信息
)


# logs config
log_path = os.path.join(os.path.dirname(__file__), "logs/log")
log_level = "debug"

# Cipher encryption key
passwd_hash_key = "BLUE"
