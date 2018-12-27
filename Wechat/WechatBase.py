# coding:utf-8
__author__ = 'BLUE'
__time__ = 'Sun Oct 28 2018 21:00:44 GMT+0800'


class WechatBase(object):
    """ 一些工具方法 """

    @classmethod
    def _transcoding(cls, data):
        """编码转换 for str
        :param data: 需要转换的数据
        :return: 转换好的数据
        """
        result = None
        if not data:
            return result
        if isinstance(data, str) and hasattr(data, 'decode'):
            result = data.decode('utf-8')
        else:
            result = data
        return result

    @classmethod
    def _transcoding_list(cls, data):
        """编码转换 for list
        :param data: 需要转换的 list 数据
        :return: 转换好的 list
        """
        if not isinstance(data, list):
            raise ValueError('Parameter data must be list object.')
        result = []
        for item in data:
            if isinstance(item, dict):
                result.append(cls._transcoding_dict(item))
            elif isinstance(item, list):
                result.append(cls._transcoding_list(item))
            elif isinstance(item, str):
                result.append(cls._transcoding(item))
            else:
                result.append(item)
        return result

    @classmethod
    def _transcoding_dict(cls, data):
        """
        编码转换 for dict
        :param data: 需要转换的 dict 数据
        :return: 转换好的 dict
        """
        if not isinstance(data, dict):
            raise ValueError('Parameter data must be dict object.')
        result = {}
        for k, v in data.items():
            k = cls._transcoding(k)
            if isinstance(v, dict):
                v = cls._transcoding_dict(v)
            elif isinstance(v, list):
                v = cls._transcoding_list(v)
            elif isinstance(v, str):
                v = cls._transcoding(v)
            result.update({k: v})
        return result
