from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import pymysql
from dotenv import load_dotenv
import os
from apscheduler.schedulers.background import BackgroundScheduler
import atexit

load_dotenv()

pymysql.install_as_MySQLdb()

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql://{os.getenv('MYSQL_USER')}:{os.getenv('MYSQL_PASSWORD')}@{os.getenv('MYSQL_HOST')}:{os.getenv('MYSQL_PORT', 3306)}/{os.getenv('MYSQL_DATABASE')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

from app import models, views, cli
from app.notification_service import NotificationService

def init_scheduler():
    with app.app_context():
        scheduler = BackgroundScheduler()
        scheduler.add_job(
            NotificationService.check_upcoming_returns,
            'interval',
            hours=12,
            id='check_upcoming_returns'
        )
        scheduler.add_job(
            NotificationService.check_overdue_returns,
            'interval',
            hours=12,
            id='check_overdue_returns'
        )
        scheduler.start()
        
        atexit.register(lambda: scheduler.shutdown())

if __name__ == '__main__':
    init_scheduler()
    app.run()