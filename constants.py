# coding:utf-8
__authon__ = 'BLUE'
__time__ = '2018-09-10T02:39:20.232Z'
import os
PIC_CODE_EXPIRES_SECONDS = 180  # 图片验证码的有效期，单位秒
SMS_CODE_EXPIRES_SECONDS = 300  # 图片验证码的有效期，单位秒

SESSION_EXPIRES_SECONDS = 3600 * 24  # session数据有效期， 单位秒

REQUEST_TIMEOUT = 20  # 网络请求超时时间（s）

QINIU_ACCESSKEY = 'A_9PcuOHD_pkCRYrtR6Dj1-h0mFX-XIl98zww16D'
QINIU_SECERTKEY = 'wtH-7C4ZOgyCgcsVwAD8lxN0CXgx8RVyAMXD4NLM'
QINIU_URL_PREFIX = 'http://wx2.chengyujiao.com/'
QINIU_BUCKET_NAME = 'pocketmaster'


WECHAT_TOKEN = "BLUE"
WECHAT_APP_ID = "wxae01f2ec1065a84c"
WECHAT_APP_SECRET = "38becfa9c4d1e3ed1f5f221e5409461d"
WECHAT_PAY_SECRET = 'c28868c9f12711e8bab15254005c9e8b'
WECHAT_PAY_MCHID = '1519091801'
# 微信支付数字证书
current_path = os.path.abspath(__file__)
WECHAT_PAY_CERT_PATH = os.path.abspath(os.path.dirname(
    current_path) + "%(sep)sWechat%(sep)scert%(sep)sapiclient_cert.pem" % dict(sep=os.path.sep))
WECHAT_PAY_KEY_PATH = os.path.abspath(os.path.dirname(
    current_path) + "%(sep)sWechat%(sep)scert%(sep)sapiclient_key.pem" % dict(sep=os.path.sep))

