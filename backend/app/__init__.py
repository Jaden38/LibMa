# app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import pymysql
from dotenv import load_dotenv
import os

load_dotenv()

pymysql.install_as_MySQLdb()

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql://{os.getenv('MYSQL_USER')}:{os.getenv('MYSQL_PASSWORD')}@{os.getenv('MYSQL_HOST')}:{os.getenv('MYSQL_PORT', 3306)}/{os.getenv('MYSQL_DATABASE')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

from app import models, views

from app import cli

if __name__ == '__main__':
    app.run()