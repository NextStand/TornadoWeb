# coding:utf-8

class RET:
    OK                  = "0"
    DBERR               = "4001"
    NODATA              = "4002"
    DATAEXIST           = "4003"
    DATAERR             = "4004"
    SESSIONERR          = "4101"
    LOGINERR            = "4102"
    PARAMERR            = "4103"
    USERERR             = "4104"
    ROLEERR             = "4105"
    PWDERR              = "4106"
    REQERR              = "4201"
    IPERR               = "4202"
    THIRDERR            = "4301"
    IOERR               = "4302"
    SERVERERR           = "4500"
    UNKOWNERR           = "4501"

class RMS:
    OK                    = "成功",
    DBERR                 = "数据库查询错误",
    NODATA                = "无数据",
    DATAEXIST             = "数据已存在",
    DATAERR               = "数据错误",
    SESSIONERR            = "用户未登录",
    LOGINERR              = "用户登录失败",
    PARAMERR              = "参数错误",
    USERERR               = "用户不存在或未激活",
    ROLEERR               = "用户身份错误",
    PWDERR                = "密码错误",
    REQERR                = "非法请求或请求次数受限",
    IPERR                 = "IP受限",
    THIRDERR              = "第三方系统错误",
    IOERR                 = "文件读写错误",
    SERVERERR             = "内部错误",
    UNKOWNERR             = "未知错误",

