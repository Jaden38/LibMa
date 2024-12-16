from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy import Enum
from app import db
from werkzeug.security import check_password_hash


# Enum definitions
class UserRole(str, Enum):
    MEMBER = 'membre'
    LIBRARIAN = 'bibliothecaire'
    ADMIN = 'administrateur'

class UserStatus(str, Enum):
    ACTIVE = 'actif'
    INACTIVE = 'inactif'
    SUSPENDED = 'suspendu'

class SampleStatus(str, Enum):
    AVAILABLE = 'disponible'
    BORROWED = 'emprunté'
    RESERVED = 'réservé'
    UNAVAILABLE = 'indisponible'

class BorrowStatus(str, Enum):
    ONGOING = 'en cours'
    COMPLETED = 'terminé'
    LATE = 'en retard'
    CANCELLED = 'annulé'

class ReservationStatus(str, Enum):
    ACTIVE = 'active'
    CONFIRMED = 'confirmée'
    CANCELLED = 'annulée'
    EXPIRED = 'expirée'

class NotificationType(str, Enum):
    BORROW_REMINDER = 'rappel_emprunt'
    NEW_RESERVATION = 'nouvelle_reservation'
    DUE_DATE = 'date_echeance'

# coding: utf-8






class Book(db.Model):
    __tablename__ = 'books'

    book_id = db.Column(db.BigInteger, primary_key=True)
    title = db.Column(db.String(255), nullable=False, index=True)
    author = db.Column(db.String(255), nullable=False, index=True)
    genre = db.Column(db.String(100))
    category = db.Column(db.String(100))
    book_description = db.Column(db.Text)
    release_date = db.Column(db.Date)
    added_at = db.Column(db.DateTime, server_default=db.FetchedValue())
    image_url = db.Column(db.String(255))



class Borrow(db.Model):
    __tablename__ = 'borrows'

    borrow_id = db.Column(db.BigInteger, primary_key=True)
    user_id = db.Column(db.ForeignKey('users.user_id', onupdate='CASCADE'), index=True)
    sample_id = db.Column(db.ForeignKey('samples.sample_id', onupdate='CASCADE'), index=True)
    borrowed_at = db.Column(db.DateTime)
    begin_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    returned_at = db.Column(db.DateTime)
    borrow_status = db.Column(db.Enum('en cours', 'terminé', 'en retard', 'annulé'), nullable=False, index=True)
    approved_by = db.Column(db.ForeignKey('users.user_id', onupdate='CASCADE'), index=True)

    user = db.relationship('User', primaryjoin='Borrow.approved_by == User.user_id', backref='user_borrows')
    sample = db.relationship('Sample', primaryjoin='Borrow.sample_id == Sample.sample_id', backref='borrows')
    user1 = db.relationship('User', primaryjoin='Borrow.user_id == User.user_id', backref='user_borrows_0')



class Log(db.Model):
    __tablename__ = 'logs'

    log_id = db.Column(db.BigInteger, primary_key=True)
    user_id = db.Column(db.ForeignKey('users.user_id', onupdate='CASCADE'), index=True)
    log_action = db.Column(db.String(255), nullable=False)
    log_details = db.Column(db.Text)
    action_date = db.Column(db.DateTime, server_default=db.FetchedValue())

    user = db.relationship('User', primaryjoin='Log.user_id == User.user_id', backref='logs')



class Notification(db.Model):
    __tablename__ = 'notifications'

    notification_id = db.Column(db.BigInteger, primary_key=True)
    user_id = db.Column(db.ForeignKey('users.user_id', onupdate='CASCADE'), index=True)
    notification_type = db.Column(db.Enum('rappel_emprunt', 'nouvelle_reservation', 'date_echeance'), nullable=False)
    notification_message = db.Column(db.Text, nullable=False)
    creation_date = db.Column(db.DateTime, server_default=db.FetchedValue())
    viewed = db.Column(db.Integer, server_default=db.FetchedValue())

    user = db.relationship('User', primaryjoin='Notification.user_id == User.user_id', backref='notifications')



class Reservation(db.Model):
    __tablename__ = 'reservations'

    reservation_id = db.Column(db.BigInteger, primary_key=True)
    user_id = db.Column(db.ForeignKey('users.user_id', onupdate='CASCADE'), index=True)
    book_id = db.Column(db.ForeignKey('books.book_id', onupdate='CASCADE'), index=True)
    borrowed_at = db.Column(db.DateTime, server_default=db.FetchedValue())
    reservation_status = db.Column(db.Enum('active', 'confirmée', 'annulée', 'expirée'), nullable=False)
    expiration_date = db.Column(db.DateTime)

    book = db.relationship('Book', primaryjoin='Reservation.book_id == Book.book_id', backref='reservations')
    user = db.relationship('User', primaryjoin='Reservation.user_id == User.user_id', backref='reservations')



class Sample(db.Model):
    __tablename__ = 'samples'

    sample_id = db.Column(db.BigInteger, primary_key=True)
    book_id = db.Column(db.ForeignKey('books.book_id', onupdate='CASCADE'), index=True)
    unique_code = db.Column(db.String(50), nullable=False, unique=True)
    sample_status = db.Column(db.Enum('disponible', 'emprunté', 'réservé', 'indisponible'), index=True, server_default=db.FetchedValue())
    procurement_date = db.Column(db.Date)
    localization = db.Column(db.String(100))

    book = db.relationship('Book', primaryjoin='Sample.book_id == Book.book_id', backref='samples')



class User(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(db.BigInteger, primary_key=True)
    lastname = db.Column(db.String(100), nullable=False)
    firstname = db.Column(db.String(100), nullable=False)
    mail = db.Column(db.String(255), nullable=False, unique=True)
    user_password = db.Column(db.String(255), nullable=False)
    creation_date = db.Column(db.DateTime, server_default=db.FetchedValue())
    user_role = db.Column(db.Enum('membre', 'bibliothecaire', 'administrateur'), nullable=False)
    user_status = db.Column(db.Enum('actif', 'inactif', 'suspendu'), server_default=db.FetchedValue())

    def check_password(self, password):
        # Compare the provided password with the stored hashed password
        return self.user_password == password
