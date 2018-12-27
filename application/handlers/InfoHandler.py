# coding:utf-8
__author__ = 'BLUE'
__time__ = 'Thu Dec 13 2018 23:20:40 GMT+0800'

import uuid
import copy
import json
from tornado import gen
from application.base.BaseHandler import BaseHandler
from application.db.MySQLHelper import db
from utils.Requestcmd import Requestcmd
from utils.res_code import RET, RMS
from utils.comm_tools import MyEncoder
from utils.session import Session


class BusiInfo(BaseHandler):
    @gen.coroutine
    def get(self):
        ret = yield Requestcmd.find4and('busi_msginfo',dict(i_id='b176eb55eefc413a8a4aca2d059948d1'))
        self.write(dict(errcode=RET.OK, errmsg=RMS.OK,
                            data=json.loads(json.dumps(ret, cls=MyEncoder))))

    @gen.coroutine
    def put(self):
        c1 = copy.deepcopy(self.args)
        troduce = c1.get('i_troduce', None)
        content = c1.get('i_content', None)
        activedate=c1.get('i_activedate', None)
        if all((troduce, content)):
            yield Requestcmd.update('busi_msginfo', dict(i_id='b176eb55eefc413a8a4aca2d059948d1'), dict(i_troduce=troduce, i_content=content,i_activedate=activedate))
            self.write(dict(errcode=RET.OK, errmsg=RMS.OK, data='b176eb55eefc413a8a4aca2d059948d1'))
        else:
            self.write(dict(errcode=RET.PARAMERR, errmsg=RMS.PARAMERR))
