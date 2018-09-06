# coding:utf-8

import os
from application.base.BaseHandler import StaticFileBaseHandler

# Application配置参数
settings = dict(
    static_path=os.path.join(os.path.dirname(__file__), "static"),
    template_path=os.path.join(os.path.dirname(__file__), "templates"),
    cookie_secret="FhLXI+BRRomtuaG47hoXEg3JCdi0BUi8vrpWmoxaoyI=",
    xsrf_cookies=True,
    debug=True
)



# 数据库配置参数
database_options = dict(
    host="192.168.0.175",
    db="ihome",
    user="root",
    password="hanmo"
)

# Redis配置参数
redis_options = dict(
    host="127.0.0.1",
    port=6379
)

# 日志配置
log_path = os.path.join(os.path.dirname(__file__), "logs/log")
log_level = "debug"

# 密码加密密钥
passwd_hash_key = "nlgCjaTXQX2jpupQFQLoQo5N4OkEmkeHsHD9+BBx2WQ="

# 静态文件处理句柄
static_file_handler = [
    (r"/upload/(.*)", StaticFileBaseHandler,
     dict(path=os.path.join(os.path.dirname(__file__), "upload")))
]
