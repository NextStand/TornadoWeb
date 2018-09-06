# coding:utf-8
__author__ = 'BLUE'

import tornado.web
import tornado.ioloop
import tornado.options
import tornado.httpserver
import redis
import config

from tornado.options import define, options
from urls_web import urls_web
from urls_admin import urls_admin

define("port", default=8000, type=int, help="run server on the given port")


class Application(tornado.web.Application):
    def __init__(self, *args, **kwargs):
        super(Application, self).__init__(*args, **kwargs)
        self.redis = redis.StrictRedis(**config.redis_options)


def main():
    # 日志位置
    # options.log_file_prefix = config.log_path
    # 日志等级
    # options.logging = config.log_level
    options.parse_command_line()
    urls_web.extend(urls_admin)
    urls_web.extend(config.static_file_handler)
    app = Application(
        urls_web,
        **config.settings
    )
    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.current().start()


if __name__ == '__main__':
    main()
