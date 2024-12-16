from functools import wraps
from flask import request, jsonify, g
from app import app, db
from app.models import User
import jwt
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class LibraryAPIProxy:
    """
    Proxy class to handle authentication, authorization, and validation
    before requests reach the main views
    """

    def __init__(self):
        self.logger = logging.getLogger(__name__)

    def verify_token(self, token):
        try:
            # Replace with your actual secret key
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None

    def check_user_permissions(self, user_id, required_role=None):
        user = User.query.get(user_id)
        if not user:
            return False
        if user.statut != 'actif':
            return False
        if required_role and user.role != required_role:
            return False
        return True

    def log_request(self, user_id, endpoint, method, status_code):
        try:
            from app.models import Log
            log = Log(
                id_utilisateur=user_id,
                action=f"{method} {endpoint}",
                details=f"Status: {status_code}"
            )
            db.session.add(log)
            db.session.commit()
        except Exception as e:
            self.logger.error(f"Error logging request: {str(e)}")


def require_auth(f):
    """Decorator to enforce authentication and authorization"""

    @wraps(f)
    def decorated(*args, **kwargs):
        proxy = LibraryAPIProxy()

        # Check for token
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Token manquant ou invalide'}), 401

        token = auth_header.split(' ')[1]
        payload = proxy.verify_token(token)

        if not payload:
            return jsonify({'error': 'Token invalide ou expiré'}), 401

        # Verify user status and permissions
        if not proxy.check_user_permissions(payload['user_id']):
            return jsonify({'error': 'Permissions insuffisantes'}), 403

        # Store user info in Flask's g object
        g.user_id = payload['user_id']
        g.user_role = payload['role']

        # Execute the view function
        response = f(*args, **kwargs)

        # Log the request
        status_code = response[1] if isinstance(response, tuple) else 200
        proxy.log_request(g.user_id, request.endpoint, request.method, status_code)

        return response

    return decorated


def require_librarian(f):
    """Decorator to enforce librarian role"""

    @wraps(f)
    def decorated(*args, **kwargs):
        proxy = LibraryAPIProxy()

        # First apply the authentication check
        @require_auth
        def checked_func(*args, **kwargs):
            if g.user_role != 'bibliothécaire':
                return jsonify({'error': 'Accès réservé aux bibliothécaires'}), 403
            return f(*args, **kwargs)

        return checked_func(*args, **kwargs)

    return decorated


# Rate limiting implementation
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

