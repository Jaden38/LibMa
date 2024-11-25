# app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

db = SQLAlchemy()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)
    
    # Load config
    app.config['SECRET_KEY'] = 'your-secret-key'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@localhost/library_db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize extensions
    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'
    
    # Register blueprints
    from app.routes import auth, books, loans, admin
    app.register_blueprint(auth.bp)
    app.register_blueprint(books.bp)
    app.register_blueprint(loans.bp)
    app.register_blueprint(admin.bp)
    
    return app