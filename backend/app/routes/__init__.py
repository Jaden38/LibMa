from .auth import auth_bp
from .books import books_bp
from .borrows import borrows_bp
from .notifications import notifications_bp

__all__ = [
    'auth_bp',
    'books_bp',
    'borrows_bp',
    'notifications_bp'
]