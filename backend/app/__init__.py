from app.notification_service import NotificationService
from app import models, views, cli
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import pymysql
from dotenv import load_dotenv
import os
from apscheduler.schedulers.background import BackgroundScheduler
import atexit
import logging


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

pymysql.install_as_MySQLdb()

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql://{os.getenv('MYSQL_USER')}:{os.getenv('MYSQL_PASSWORD')}@{
    os.getenv('MYSQL_HOST')}:{os.getenv('MYSQL_PORT', 3306)}/{os.getenv('MYSQL_DATABASE')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


def init_scheduler():
    with app.app_context():
        try:
            scheduler = BackgroundScheduler()

            scheduler.add_job(
                NotificationService.check_upcoming_returns,
                'interval',
                hours=12,
                id='check_upcoming_returns',
                max_instances=1,
                replace_existing=True
            )

            scheduler.add_job(
                NotificationService.check_overdue_returns,
                'interval',
                hours=12,
                id='check_overdue_returns',
                max_instances=1,
                replace_existing=True
            )

            scheduler.start()
            logger.info("Scheduler started successfully")

            def cleanup_scheduler():
                scheduler.shutdown()
                logger.info("Scheduler shut down successfully")

            atexit.register(cleanup_scheduler)

        except Exception as e:
            logger.error(f"Error initializing scheduler: {str(e)}")
            raise


if __name__ == '__main__':
    init_scheduler()
    app.run()
