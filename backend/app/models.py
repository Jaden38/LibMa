from app import db
from datetime import datetime
from sqlalchemy import Enum

class Utilisateur(db.Model):
    __tablename__ = 'utilisateurs'
    
    id_utilisateur = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    prenom = db.Column(db.String(100), nullable=False)
    mail = db.Column(db.String(255), unique=True, nullable=False)
    mot_de_passe = db.Column(db.String(255), nullable=False)
    date_creation = db.Column(db.DateTime, default=datetime.utcnow)
    role = db.Column(Enum('membre', 'bibliothécaire', 'administrateur', name='role_types'), nullable=False)
    statut = db.Column(Enum('actif', 'inactif', 'suspendu', name='statut_types'), default='actif')

    # Relations
    emprunts = db.relationship('Emprunt', backref='utilisateur', foreign_keys='Emprunt.id_utilisateur')
    emprunts_approuves = db.relationship('Emprunt', backref='approuve_par_user', foreign_keys='Emprunt.approuve_par')
    reservations = db.relationship('Reservation', backref='utilisateur')
    notifications = db.relationship('Notification', backref='utilisateur')
    logs = db.relationship('Log', backref='utilisateur')

    def __repr__(self):
        return f'<Utilisateur {self.prenom} {self.nom}>'

class Livre(db.Model):
    __tablename__ = 'livres'
    
    id_livre = db.Column(db.Integer, primary_key=True)
    titre = db.Column(db.String(255), nullable=False)
    auteur = db.Column(db.String(255), nullable=False)
    genre = db.Column(db.String(100))
    categorie = db.Column(db.String(100))
    date_sortie = db.Column(db.Date)
    date_ajout = db.Column(db.DateTime, default=datetime.utcnow)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(255))
    
    # Relations
    exemplaires = db.relationship('Exemplaire', backref='livre')
    reservations = db.relationship('Reservation', backref='livre')

    def __repr__(self):
        return f'<Livre {self.titre}>'

class Exemplaire(db.Model):
    __tablename__ = 'exemplaires'
    
    id_exemplaire = db.Column(db.Integer, primary_key=True)
    id_livre = db.Column(db.Integer, db.ForeignKey('livres.id_livre'))
    code_unique = db.Column(db.String(50), unique=True, nullable=False)
    statut = db.Column(Enum('disponible', 'emprunté', 'réservé', 'indisponible', name='statut_exemplaire'), default='disponible')
    date_acquisition = db.Column(db.Date)
    localisation = db.Column(db.String(100))

    # Relations
    emprunts = db.relationship('Emprunt', backref='exemplaire')

    def __repr__(self):
        return f'<Exemplaire {self.code_unique}>'

class Emprunt(db.Model):
    __tablename__ = 'emprunts'
    
    id_emprunt = db.Column(db.Integer, primary_key=True)
    id_utilisateur = db.Column(db.Integer, db.ForeignKey('utilisateurs.id_utilisateur'))
    id_exemplaire = db.Column(db.Integer, db.ForeignKey('exemplaires.id_exemplaire'))
    date_reservation = db.Column(db.DateTime)
    date_debut = db.Column(db.DateTime, nullable=False)
    date_fin = db.Column(db.DateTime, nullable=False)
    date_retour = db.Column(db.DateTime)
    statut = db.Column(Enum('en cours', 'terminé', 'en retard', 'annulé', name='statut_emprunt'), nullable=False)
    approuve_par = db.Column(db.Integer, db.ForeignKey('utilisateurs.id_utilisateur'))

    def __repr__(self):
        return f'<Emprunt {self.id_emprunt}>'

class Reservation(db.Model):
    __tablename__ = 'reservations'
    
    id_reservation = db.Column(db.Integer, primary_key=True)
    id_utilisateur = db.Column(db.Integer, db.ForeignKey('utilisateurs.id_utilisateur'))
    id_livre = db.Column(db.Integer, db.ForeignKey('livres.id_livre'))
    date_reservation = db.Column(db.DateTime, default=datetime.utcnow)
    statut = db.Column(Enum('active', 'confirmée', 'annulée', 'expirée', name='statut_reservation'), nullable=False)
    date_expiration = db.Column(db.DateTime)

    def __repr__(self):
        return f'<Reservation {self.id_reservation}>'

class Notification(db.Model):
    __tablename__ = 'notifications'
    
    id_notification = db.Column(db.Integer, primary_key=True)
    id_utilisateur = db.Column(db.Integer, db.ForeignKey('utilisateurs.id_utilisateur'))
    type = db.Column(Enum('rappel_emprunt', 'nouvelle_reservation', 'date_echeance', name='type_notification'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    date_creation = db.Column(db.DateTime, default=datetime.utcnow)
    lu = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f'<Notification {self.id_notification}>'

class Log(db.Model):
    __tablename__ = 'logs'
    
    id_log = db.Column(db.Integer, primary_key=True)
    id_utilisateur = db.Column(db.Integer, db.ForeignKey('utilisateurs.id_utilisateur'))
    action = db.Column(db.String(255), nullable=False)
    details = db.Column(db.Text)
    date_action = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Log {self.id_log}>'