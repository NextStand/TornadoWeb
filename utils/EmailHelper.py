# coding:utf-8
__author__ = 'BLUE'
__time__ = 'Wed Oct 24 2018 15:14:30 GMT+0800'

import smtplib
import os

from config import email_options
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from email.Utils import formatdate
from email.Header import Header


class SendEmail(object):
    """ 发送邮件服务 """
    @classmethod
    def sendTxtMail(cls, tolist, title, content):
        """
        发送纯文本邮件
        :param tolist:list 接收人邮箱列表
        :param title:str 邮件标题
        :param content:str 邮件内容
        :retrun:bool
        """
        return cls.__txthtml(tolist, title, content, 'plain')

    @classmethod
    def sendHtmlMail(cls, tolist, title, content):
        """
        发送html邮件
        :param tolist:list 接收人邮箱列表
        :param title:str 邮件标题
        :param content:str 邮件内容
        :retrun:bool
        """
        return cls.__txthtml(tolist, title, content, 'html')

    @classmethod
    def sendTxtAttach(cls, tolist, title, content, attachList):
        """ 
        发送带附件的文本 
        :param tolist:list 接收人邮箱列表
        :param title:str 邮件标题
        :param content:str 邮件内容
        :param attachList:list 文件绝对路径
        :retrun:bool
        """
        return cls.__sendAttachMail(tolist, title, content, attachList)

    @classmethod
    def sendHtmlAttach(cls, tolist, title, content, attachList):
        """ 
        发送带附件的html
        :param tolist:list 接收人邮箱列表
        :param title:str 邮件标题
        :param content:str 邮件内容
        :param attachList:list 文件绝对路径
        :retrun:bool
        """
        return cls.__sendAttachMail(tolist, title, content, attachList, 'html')

    __me = '%s<%s>' % (email_options.get('identity',''),
                       email_options.get('username'))

    @classmethod
    def __sendAttachMail(cls, tolist, title, content, attachList, subtype='plain'):
        msg = MIMEMultipart()
        msg.attach(MIMEText(content, _subtype=subtype, _charset='utf-8'))
        for index, file in enumerate(attachList):
            with open(file, 'rb') as f:
                apart = MIMEApplication(f.read(), file.split('.')[-1])
                apart.add_header('Content-Disposition',
                                 'attachment', filename=os.path.basename(file))
                apart.add_header('Content-ID', '<%s>' % index)
                apart.add_header('X-Attachment-Id', '%s' % index)
                msg.attach(apart)
        return cls.__sendMail(msg, tolist, title)

    @classmethod
    def __login(cls):
        smtp = smtplib.SMTP()
        smtp.connect(email_options.get('smtpHost'),
                     email_options.get('smtpPort', '25'))
        # 加密传输
        smtp.ehlo()
        smtp.starttls()
        smtp.login(email_options.get('username'),
                   email_options.get('password'))
        return smtp

    @classmethod
    def __txthtml(cls, tolist, title, content, type):
        msg = MIMEText(content, type, _charset='utf-8')
        return cls.__sendMail(msg, tolist, title)

    @classmethod
    def __sendMail(cls, msg, tolist, title):
        smtp = cls.__login()
        msg['Subject'] = Header(title, 'utf-8').encode()
        msg['From'] = cls.__me
        msg['To'] = ";".join(tolist)
        msg['Date'] = formatdate()
        try:
            smtp.sendmail(email_options.get('username'),
                          tolist, msg.as_string())
            result = True
        except Exception as e:
            result = False
        finally:
            smtp.quit()
            smtp.close()
            return result


class RecvEmail(object):
    """ 接收邮件服务 """
    pass


if __name__ == '__main__':
    # 发送纯文本
    # print SendEmail.sendTxtMail(['2112316557@qq.com'],u'邮件标题',u'邮件内容')

    # 发送html，html
    # print SendEmail.sendHtmlMail(['2112316557@qq.com'],u'邮件标题',u'<h1>你好</h1>')

    # 发送纯文本携带附件
    # print SendEmail.sendTxtAttach(['2112316557@qq.com'],u'邮件标题',u'你好',[r'F:\TornadoWeb\code\utils\1.png'.decode('utf-8')])

    # 发送有图片附件再html中的邮件，QQ邮箱要屏蔽，其他的没有测试
    # SendEmail.sendHtmlAttach(['18483633315@163.com'], u'附件邮件', '<html><body><h1>Hello</h1>' +
    #                          '<p><img src="cid:0"></p>' +
    #                          '</body></html>', [
    #                          r'F:\TornadoWeb\code\utils\1.png'.decode('utf-8')])
