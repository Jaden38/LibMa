import os
import jwt
from datetime import datetime, timezone
from flask import current_app
from config import JWT_ACCESS_TOKEN_EXPIRES, JWT_REFRESH_TOKEN_EXPIRES


class TokenService:
    @staticmethod
    def generate_token(user_id, role, token_type='access'):
        """
        Generate JWT token
        """

        if token_type == 'access':
            expiration = datetime.now(timezone.utc) + JWT_ACCESS_TOKEN_EXPIRES
        else:
            expiration = datetime.now(timezone.utc) + JWT_REFRESH_TOKEN_EXPIRES

        payload = {
            'user_id': user_id,
            'role': role,
            'type': token_type,
            'exp': expiration,
            'iat': datetime.now(timezone.utc)
        }

        return jwt.encode(payload, os.getenv('SECRET_KEY'), algorithm='HS256')