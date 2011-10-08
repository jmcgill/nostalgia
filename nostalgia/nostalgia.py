from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext.webapp import template
from google.appengine.ext import db

import base64
import os
import random
import re
import struct

import logging

def encode(n):
  data = struct.pack('<Q', n).rstrip('\x00')
  if len(data)==0:
    data = '\x00'
  s = base64.urlsafe_b64encode(data).rstrip('=')
  return s

def decode(s):
  data = base64.urlsafe_b64decode(s + '==')
  n = struct.unpack('<Q', data + '\x00'* (8-len(data)) )
  return n[0]

class Program(db.Model):
  program = db.TextProperty(required = True)
  id = db.StringProperty(required = True)

class NewProgram(webapp.RequestHandler):
  def get(self):
    bits = random.getrandbits(64)
    id = encode(bits)
    self.redirect('/code/' + id)    

class SaveProgram(webapp.RequestHandler):
  def post(self):
    id = self.request.get('id')
    program = self.request.get('program')
    program_models = db.GqlQuery("SELECT * FROM Program WHERE id = :1", id)
    if program_models.count() > 0:
      program_model = program_models[0]
    else:
      program_model = Program(id = id, program = program)
    program_model.program = program
    program_model.put()

class LoadProgram(webapp.RequestHandler):
  def get(self, id):
    program = ''
    program_model = db.GqlQuery("SELECT * FROM Program WHERE id = :1", id)
    if program_model.count() > 0:
       program = program_model[0].program.replace('"', "'")
#replace('"', "'"),
    variables = {
      'program': program.replace('\n', '\\n'),
      'id': id
    }
    logging.error(program)
    path = os.path.join(os.path.dirname(__file__), 'templates/index.html')
    self.response.out.write(template.render(path, variables))
 
application = webapp.WSGIApplication([
    ('/', NewProgram),
    ('/code/(.+)', LoadProgram),
    ('/save', SaveProgram)], debug=True)

def main():
  run_wsgi_app(application)

if __name__ == "__main__":
  main()
