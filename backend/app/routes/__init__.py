from .auth import auth_bp
from .books import books_bp
from .borrows import borrows_bp
from .librarians import librarians_bp
from .notifications import notifications_bp
from .samples import samples_bp

__all__ = [
    'auth_bp',
    'books_bp',
    'samples_bp',
    'borrows_bp',
    'librarians_bp',
    'notifications_bp'
]