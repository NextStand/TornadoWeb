# coding:utf-8
__author__ = 'BLUE'
__time__ = 'Thu Dec 13 2018 23:20:40 GMT+0800'

import uuid
import copy
import json
import datetime
from tornado import gen
from application.base.BaseHandler import BaseHandler
from application.db.MySQLHelper import db
from utils.Requestcmd import Requestcmd
from utils.res_code import RET, RMS
from utils.comm_tools import MyEncoder
from utils.WxToken import AccessToken
from utils.decorator import require_login
from Wechat.WechatBasic import WechatBasic


class Share(BaseHandler):
    @gen.coroutine
    def get(self):
        c1 = copy.deepcopy(self.args) if self.args else {}
        shareid = c1.get('b_shareid', None)
        if shareid:
            ret = yield db.callproc('wx_check_tz', (shareid,))
            d = ret[0]
            self.write(dict(errcode=d.get('errcode'),
                            errmsg=[d.get('errmsg')]))
        else:
            self.write(dict(errcode=RET.PARAMERR, errmsg=RMS.PARAMERR))

    @gen.coroutine
    def post(self):
        shareid = self.args.get('b_shareid', None)
        if shareid:
            try:
                yield Requestcmd.insert('busi_share', dict(b_shareid=shareid))
                access = yield AccessToken.get_access_token()
                wechat = WechatBasic(access_token=access.get(
                    'access_token'), access_token_expires_at=access.get('expires_at'))
                templateid = '13EKjS77LsOXHfj11bDjbl2yePO-rr9Vy9_EWvTNobw'
                url = 'http://dftp.ystsj.net/tz/wx#/activityintro'
                data = {
                    'first': {'value': u'你的分享已生效，可以进行投注\n', "color": "#173177"},
                    'keyword1': {'value':u'分享生效通知'},
                    'keyword2': {'value': datetime.datetime.now().strftime('%Y-%m-%d %H:%M'), "color": "#173177"},
                    'keyword3': {'value': u'--'},
                    'remark': {'value': u'\n点击查看详细信息'}
                }
                try:
                    yield wechat.send_template_message(shareid, templateid, data, url=url)
                except Exception as e:
                    pass
            except Exception as e:
                pass
            finally:
                self.write(dict(errcode=RET.OK, errmsg=RMS.OK))
        else:
            self.write(dict(errcode=RET.PARAMERR, errmsg=RMS.PARAMERR))


class WxCheck(BaseHandler):
    @gen.coroutine
    def get(self):
        c1 = copy.deepcopy(self.args) if self.args else {}
        if c1.get('t_uid', None):
            sql = 'SELECT COUNT(id) as _count FROM busi_tzcord WHERE t_uid=%s'
            ret = yield db.fetchone(sql, (c1.get('t_uid'),))
            self.write(dict(errcode=RET.OK, errmsg=RMS.OK,
                            data=ret.get('_count')))
        else:
            self.write(dict(errcode=RET.PARAMERR, errmsg=RMS.PARAMERR))


class WxTzcode(BaseHandler):
    @gen.coroutine
    def get(self):
        c1 = copy.deepcopy(self.args) if self.args else {}
        if c1.get('t_uid', None):
            ret = yield db.callproc('wx_get_tzinfo', (c1.get('t_uid'),))
            self.write(dict(errcode=RET.OK, errmsg=RMS.OK,
                            data=json.loads(json.dumps(ret, cls=MyEncoder))))
        else:
            self.write(dict(errcode=RET.PARAMERR, errmsg=RMS.PARAMERR))

    @gen.coroutine
    def post(self):
        c1 = copy.deepcopy(self.args) if self.args else {}
        t_uid = c1.get('t_uid', None)
        t_name = c1.get('t_name', None)
        t_tel = c1.get('t_tel', None)
        t_carid = c1.get('t_carid', None)
        t_tzcode = c1.get('t_tzcode', None)
        if all((t_uid, t_name, t_tel, t_carid, t_tzcode)):
            ret = yield db.callproc('wx_check_tz', (t_uid,))
            if str(ret[0].get('errcode')) == '0':
                try:
                    yield Requestcmd.insert('busi_tzcord', dict(t_uid=t_uid, t_name=t_name, t_tel=t_tel, t_carid=t_carid, t_tzcode=t_tzcode))
                except Exception as e:
                    self.write(dict(errcode=RET.DATAEXIST,
                                    errmsg=[u'该用户已投注，不允许再次投注']))
                else:
                    access = yield AccessToken.get_access_token()
                    wechat = WechatBasic(access_token=access.get(
                        'access_token'), access_token_expires_at=access.get('expires_at'))
                    templateid = 'leNIrs_hrXB9ksN1Mkac7-M3b0uRcCWdp_w9NLfNIi0'
                    url = 'http://dftp.ystsj.net/tz/wx#/myactivity'
                    data = {
                        'first': {'value': u'%s你好，恭喜你投注成功\n' % t_name, "color": "#173177"},
                        'keyword1': {'value': u'投注号码-%s'%t_tzcode, "color": "#173177"},
                        'keyword2': {'value': datetime.datetime.now().strftime('%Y-%m-%d %H:%M'), "color": "#173177"},
                        'remark': {'value': u'\n点击查看详细信息'}
                    }
                    try:
                        yield wechat.send_template_message(t_uid, templateid, data, url=url)
                    except Exception as e:
                        pass
                    self.write(dict(errcode=RET.OK, errmsg=RMS.OK))
            else:
                self.write(dict(errcode=ret[0].get(
                    'errcode'), errmsg=[ret[0].get('errmsg')]))
        else:
            self.write(dict(errcode=RET.PARAMERR, errmsg=RMS.PARAMERR))


class WxWork(BaseHandler):
    @gen.coroutine
    def put(self, f):
        if f == 'active' or f == 'cash':
            c1 = copy.deepcopy(self.args) if self.args else {}
            uid = c1.get('t_uid', None)
            if uid:
                ret = yield db.callproc('wx_work_tz', (uid, f))
                if str(ret[0].get('errcode')) == '0':
                    access = yield AccessToken.get_access_token()
                    wechat = WechatBasic(access_token=access.get(
                        'access_token'), access_token_expires_at=access.get('expires_at'))
                    url = 'http://dftp.ystsj.net/tz/wx#/myactivity'
                    templateid = ''
                    data = None
                    if f == 'active':
                        templateid = 'RjpcVpp4lCjvOrF7rhLEOHfxWH2INqT5-BlAiTAaOW8'
                        data = {
                            'first': {'value': u'你的投注号码已经成功激活\n', "color": "#173177"},
                            'keyword1': {'value': datetime.datetime.now().strftime('%Y-%m-%d %H:%M'), "color": "#173177"},
                            'keyword2': {'value': u'已激活|未兑奖', "color": "#173177"},
                            'remark': {'value': u'\n点击查看详细信息'}
                        }
                    else:
                        templateid = 'leNIrs_hrXB9ksN1Mkac7-M3b0uRcCWdp_w9NLfNIi0'
                        data = {
                            'first': {'value': u'你的投注号码已经兑奖完成\n', "color": "#173177"},
                            'keyword1': {'value': u'已激活|已兑奖', "color": "#173177"},
                            'keyword2': {'value': datetime.datetime.now().strftime('%Y-%m-%d %H:%M'), "color": "#173177"},
                            'remark': {'value': u'\n点击查看详细信息'}
                        }
                    try:
                        yield wechat.send_template_message(uid, templateid, data, url=url)
                    except Exception as e:
                        pass
                self.write(dict(errcode=ret[0].get(
                    'errcode'), errmsg=[ret[0].get('errmsg')]))
            else:
                self.write(dict(errcode=RET.PARAMERR, errmsg=RMS.PARAMERR))
        else:
            self.write(dict(errcode=RET.REQERR, errmsg=RMS.REQERR))
