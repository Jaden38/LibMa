from app.models import User, UserRole
from werkzeug.security import generate_password_hash
from flask import abort
from enum import Enum

class UserFactory:
    @staticmethod
    def create_user(email: str, password: str, firstname: str, lastname: str, role: str = 'membre', creator_role: str = None) -> User:
        """
        Creates a user with the specified role if the creator has sufficient permissions.
        
        Args:
            email: User's email address
            password: User's password
            firstname: User's first name
            lastname: User's last name
            role: Role to assign to the new user (default: 'membre')
            creator_role: Role of the user creating this new user (None for self-registration)
            
        Returns:
            User: The created user instance
            
        Raises:
            ValueError: If the role is invalid or if the creator lacks sufficient permissions
        """
        
        valid_roles = ['membre', 'bibliothecaire', 'administrateur']
        
        if role not in valid_roles:
            raise ValueError(f"Invalid role: {role}")
        
        if creator_role is None:
            if role != 'membre':
                raise ValueError("Self-registration is only allowed for membre role")
        elif creator_role == 'administrateur':
            pass
        elif creator_role == 'bibliothecaire':
            if role != 'membre':
                raise ValueError("Librarians can only create membre accounts")
        else:
            raise ValueError("Insufficient permissions to create users")

        new_user = User(
            mail=email,
            firstname=firstname,
            lastname=lastname,
            user_role=role,
            user_status='actif'
        )
        new_user.user_password = generate_password_hash(password)
        
        return new_user

    @staticmethod
    def validate_user_data(email: str, password: str, firstname: str, lastname: str) -> None:
        """
        Validates user data before creation.
        
        Raises:
            ValueError: If any of the validation checks fail
        """
        if not all([email, password, firstname, lastname]):
            raise ValueError("All fields are required")
            
        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters long")
            
        if not email or '@' not in email:
            raise ValueError("Invalid email format")