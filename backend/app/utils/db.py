from flask_sqlalchemy import SQLAlchemy
from app.utils.singleton import SingletonMeta

class Database(metaclass=SingletonMeta):
    def __init__(self, app=None):
        self.db = SQLAlchemy(app) if app else None

    def init_app(self, app):
        if self.db is None:
            self.db = SQLAlchemy(app)

    def get_db(self):
        return self.db
