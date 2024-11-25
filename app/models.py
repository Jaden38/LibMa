from app import db
from flask_login import UserMixin
from datetime import datetime

class User(UserMixin, db.Model):
    __tablename__ = 'utilisateurs'
    id = db.Column('id_utilisateur', db.Integer, primary_key=True, autoincrement=True)
    nom = db.Column(db.String(100), nullable=False)
    prenom = db.Column(db.String(100), nullable=False)
    mail = db.Column(db.String(255), unique=True, nullable=False)
    mot_de_passe = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum('membre', 'bibliothecaire', 'administrateur'), nullable=False)
    statut = db.Column(db.String(50), default='actif')

class Book(db.Model):
    __tablename__ = 'livres'
    id = db.Column('id_livre', db.Integer, primary_key=True)
    titre = db.Column(db.String(255), nullable=False)
    auteur = db.Column(db.String(255), nullable=False)
    genre = db.Column(db.String(100))
    categorie = db.Column(db.String(100))
    description = db.Column(db.Text)