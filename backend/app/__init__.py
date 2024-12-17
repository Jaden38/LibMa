from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_cors import CORS
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

CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql://{os.getenv('MYSQL_USER')}:{os.getenv('MYSQL_PASSWORD')}@{os.getenv('MYSQL_HOST')}:{os.getenv('MYSQL_PORT', 3306)}/{os.getenv('MYSQL_DATABASE')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["1000 per day", "100 per hour"]
)

def init_scheduler(notification_service):
    with app.app_context():
        try:
            scheduler = BackgroundScheduler()         
            
            scheduler.add_job(
                notification_service.check_upcoming_returns,
                'interval',
                hours=12,
                id='check_upcoming_returns',
                max_instances=1,
                replace_existing=True
            ) 
            scheduler.add_job(
                notification_service.check_overdue_returns,
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

from app import models
from app.services.notification_service import NotificationService

from app.routes.auth import auth_bp
from app.routes.books import books_bp
from app.routes.samples import samples_bp
from app.routes.notifications import notifications_bp

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(books_bp, url_prefix='/livres')
app.register_blueprint(samples_bp, url_prefix='/exemplaires')
app.register_blueprint(notifications_bp, url_prefix='/notifications')

from app import cli

if __name__ == '__main__':
    init_scheduler(NotificationService)
    app.run()