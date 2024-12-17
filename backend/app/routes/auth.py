import os

from flask import Blueprint, request, jsonify
from app.models import User
from app.services.token_service import TokenService
from app.utils.decorators import require_auth
from app.utils.token_blacklist import token_blacklist
import jwt

from app import db

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/login', methods=['POST'])
def login():

    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(mail=username).first()

    if user and user.check_password(password):
        # Generate tokens
        access_token = TokenService.generate_token(user.user_id, user.user_role, 'access')
        refresh_token = TokenService.generate_token(user.user_id, user.user_role, 'refresh')

        return jsonify({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user_id': user.user_id,
            'user_role': user.user_role
        }), 200

    return jsonify({'error': 'Invalid credentials'}), 401


@auth_bp.route('/refresh', methods=['POST'])
def refresh_token():
    data = request.get_json()
    refresh_token = data.get('refresh_token')

    try:
        payload = jwt.decode(
            refresh_token,
            os.getenv('SECRET_KEY'),
            algorithms=['HS256']
        )

        # Ensure it's a refresh token
        if payload.get('type') != 'refresh':
            return jsonify({'error': 'Invalid refresh token'}), 401

        # Generate new access token
        new_access_token = TokenService.generate_token(
            payload['user_id'],
            payload['role'],
            'access'
        )

        return jsonify({
            'access_token': new_access_token
        }), 200

    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Refresh token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid refresh token'}), 401


@auth_bp.route('/logout', methods=['POST'])
@require_auth
def logout():
    # Get current token from Authorization header
    token = request.headers.get('Authorization').split(' ')[1]

    # Blacklist the token
    token_blacklist.blacklist_token(token)

    return jsonify({'message': 'Successfully logged out'}), 200