from flask_sqlalchemy import SQLAlchemy
import logging as lg

from .views import app

# Create database connection object
db = SQLAlchemy(app)

class Entity(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    def __init__(self):
        ...

def init_db():
    #db.drop_all()
    #db.create_all()
    #db.session.add(Entity())
    #db.session.commit()
    #lg.warning('Database initialized!')
    ...