# coding:utf-8
__author__ = 'BLUE'
__time__ = 'Sun Oct 28 2018 22:42:08 GMT+0800'
import hashlib
from .Exceptions import CryptoComputeSignatureError
from Wechat.Utils import to_binary


def get_sha1_signature(token, timestamp, nonce, encrypt):
    """
    用 SHA1 算法生成安全签名
    @param token: 票据
    @param timestamp: 时间戳
    @param nonce: 随机字符串
    @param encrypt: 密文
    @return: 安全签名
    """
    try:
        sortlist = [token, timestamp, nonce, to_binary(encrypt)]
        sortlist.sort()
        sha = hashlib.sha1()
        sha.update(to_binary("").join(sortlist))
        return sha.hexdigest()
    except Exception as e:
        raise CryptoComputeSignatureError(e)
