import os

from flask import Blueprint, request, jsonify, g
from app.models import User
from app.services.token_service import TokenService
from app.utils.decorators import require_auth
from app.utils.token_blacklist import token_blacklist
from app.utils.user_factory import UserFactory
import jwt

from app import db

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    try:
        user = User.query.filter_by(mail=username).first()

        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401

        if user.user_status != 'actif':
            return jsonify({'error': 'Account is not active'}), 403

        if not user.check_password(password):
            return jsonify({'error': 'Invalid credentials'}), 401

        access_token = TokenService.generate_token(user.user_id, user.user_role, 'access')
        refresh_token = TokenService.generate_token(user.user_id, user.user_role, 'refresh')

        return jsonify({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user_id': user.user_id,
            'user_role': user.user_role,
            'user': {
                'firstname': user.firstname,
                'lastname': user.lastname,
                'email': user.mail
            }
        }), 200

    except Exception as e:
        return jsonify({'error': 'An error occurred during login'}), 500
    
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

        if payload.get('type') != 'refresh':
            return jsonify({'error': 'Invalid refresh token'}), 401

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
    token = request.headers.get('Authorization').split(' ')[1]
    token_blacklist.blacklist_token(token)

    return jsonify({'message': 'Successfully logged out'}), 200



@auth_bp.route('/register', methods=['POST'])
@require_auth(optional=True)
def register():
    data = request.get_json()
    
    if User.query.filter_by(mail=data.get('email')).first():
        return jsonify({'error': 'Email already registered'}), 409
        
    try:
        UserFactory.validate_user_data(
            email=data.get('email'),
            password=data.get('password'),
            firstname=data.get('firstname'),
            lastname=data.get('lastname')
        )
        
        new_user = UserFactory.create_user(
            email=data.get('email'),
            password=data.get('password'),
            firstname=data.get('firstname'),
            lastname=data.get('lastname'),
            role=data.get('role', 'membre'),
            creator_role=g.user_role if hasattr(g, 'user_role') and g.user_role else None
        )
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
        
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Registration failed'}), 500

    if not hasattr(g, 'user_role') or not g.user_role:
        access_token = TokenService.generate_token(new_user.user_id, new_user.user_role, 'access')
        refresh_token = TokenService.generate_token(new_user.user_id, new_user.user_role, 'refresh')
        
        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user_id': new_user.user_id,
            'user_role': new_user.user_role
        }), 201
    
    return jsonify({
        'message': 'User created successfully',
        'user_id': new_user.user_id,
        'user_role': new_user.user_role
    }), 201