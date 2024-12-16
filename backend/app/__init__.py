from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
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

app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql://{os.getenv('MYSQL_USER')}:{os.getenv('MYSQL_PASSWORD')}@{os.getenv('MYSQL_HOST')}:{os.getenv('MYSQL_PORT', 3306)}/{os.getenv('MYSQL_DATABASE')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Rate limiting
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

# Rate limiting
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


from app.notification_service import NotificationService


from app import views, cli
from app import models, views, cli

# Register blueprints
from app.routes.auth import auth_bp
#from app.routes.user import user_bp  # not implemented yet
from app.routes.library import library_bp #implementation example based on view.py

app.register_blueprint(auth_bp, url_prefix='/auth')
#app.register_blueprint(user_bp, url_prefix='/users')  # not implemented yet
app.register_blueprint(library_bp, url_prefix='/library') #implementation example based on view.py

if __name__ == '__main__':
    init_scheduler(NotificationService)
    app.run()