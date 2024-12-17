from .auth import auth_bp
from .books import books_bp
from .notifications import notifications_bp
from .samples import samples_bp

__all__ = [
    'auth_bp',
    'books_bp',
    'samples_bp',
    'notifications_bp'
]