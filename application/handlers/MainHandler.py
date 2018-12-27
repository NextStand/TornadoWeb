# coding:utf-8
from tornado.web import RequestHandler

class IndexHandler(RequestHandler):
    def get(self,f):
        if f=='pc':
            self.render('indexpc.html')
        elif f=='wx':
            self.render('index.html')
        else:
            self.write('404')
        
