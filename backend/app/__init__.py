# app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import pymysql
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Required for PyMySQL to work with SQLAlchemy
pymysql.install_as_MySQLdb()

# Create the flask app
app = Flask(__name__)

# Config options
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql://{os.getenv('MYSQL_USER')}:{os.getenv('MYSQL_PASSWORD')}@{os.getenv('MYSQL_HOST')}:{os.getenv('MYSQL_PORT', 3306)}/{os.getenv('MYSQL_DATABASE')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Create database connection object
db = SQLAlchemy(app)

# Import models and routes
from app import models, views

# Import CLI commands
from app import cli

if __name__ == '__main__':
    app.run()