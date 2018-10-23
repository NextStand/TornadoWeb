# coding:utf-8
import json
import sys
from datetime import date, datetime


class MyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        if isinstance(obj, datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(obj, date):
            return obj.strftime('%Y-%m-%d')
        else:
            return json.JSONEncoder.default(self, obj)


def tostr(str2):
    """ 对前端编码数据进行解码 """
    if str2 and isinstance(str2, str):
        if str2.startswith('~h`') or str2.startswith('~h%60'):
            str2 = str2 = str2[5:] if str2.startswith('~h%60') else str2[3:]
            if str2:
                st, i, rs = ('', 1, [])
                while i <= len(str2) / 4:
                    rs.extend([r"%u", str2[4 * i - 2:4 * i],
                               str2[4 * i - 4:4 * i - 2]])
                    i += 1
                st = ''.join(rs)
                st = ''.join([(len(i) > 0 and unichr(int(i, 16)) or "")
                              for i in st.split(r'%u')])
                return st
            else:
                return ''
        else:
            return str2
    else:
        return str2
