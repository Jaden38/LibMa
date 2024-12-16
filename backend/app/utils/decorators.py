import os
from functools import wraps
from flask import request, jsonify, g
import jwt
from app import db
from app.models import User
from app.utils.token_blacklist import token_blacklist
from flask import current_app


def require_auth(f):
    """Decorator to enforce authentication and authorization"""

    @wraps(f)
    def decorated(*args, **kwargs):
        # Token verification logic
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Missing or invalid token'}), 401

        token = auth_header.split(' ')[1]

        # Check if token is blacklisted
        if token_blacklist.is_blacklisted(token):
            return jsonify({'error': 'Token has been revoked'}), 401

        try:
            payload = jwt.decode(
                token,
                os.getenv('SECRET_KEY'),
                algorithms=['HS256']
            )
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        # Verify user exists and is active
        user = User.query.get(payload['user_id'])
        if not user or user.user_status != 'actif':
            return jsonify({'error': 'User not found or inactive'}), 403

        # Store user info in Flask's g object
        g.user_id = payload['user_id']
        g.user_role = payload['role']

        return f(*args, **kwargs)

    return decorated


def require_role(role):
    """Decorator to enforce specific user roles"""

    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not hasattr(g, 'user_role') or g.user_role != role:
                return jsonify({'error': f'Access denied. Requires {role} role.'}), 403
            return f(*args, **kwargs)

        return decorated_function

    return decorator