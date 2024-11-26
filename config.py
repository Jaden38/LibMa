import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

basedir = os.path.abspath(os.path.dirname(__file__))

# MySQL configuration from environment variables
MYSQL_USER = os.getenv('MYSQL_USER')
MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD')
MYSQL_HOST = os.getenv('MYSQL_HOST')
MYSQL_PORT = os.getenv('MYSQL_PORT', '3306')  # Default to 3306 if not specified
MYSQL_DATABASE = os.getenv('MYSQL_DATABASE')

# SQLAlchemy configuration
SQLALCHEMY_DATABASE_URI = f'mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}'
SQLALCHEMY_TRACK_MODIFICATIONS = False

# Flask configuration
PORT = int(os.getenv('FLASK_PORT', 5000))  # Default to 5000 if not specified