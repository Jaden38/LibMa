from functools import wraps
from flask import jsonify, request, Blueprint
import logging
from app import app, db
from app.models import User
import jwt
from datetime import datetime
import os

logger = logging.getLogger(__name__)
members_bp = Blueprint('membres', __name__)

# Note: Removed trailing slash in route
@members_bp.route('/')
def get_members():
    try:
        email = request.args.get('email')
        if email:
            member = User.query.filter_by(user_role='membre', mail=email).first()
            if not member:
                return jsonify(None), 404
                
            result = {
                "id": member.user_id,
                "lastname": member.lastname,
                "firstname": member.firstname,
                "email": member.mail,
                "status": member.user_status,
                "creation_date": member.creation_date.isoformat() if member.creation_date else None
            }
            return jsonify(result)
            
        members = User.query.filter_by(user_role='membre').all()
        logger.debug(f"Number of members found: {len(members)}")

        result = [{
            "id": member.user_id,
            "lastname": member.lastname,
            "firstname": member.firstname,
            "email": member.mail,
            "status": member.user_status,
            "creation_date": member.creation_date.isoformat() if member.creation_date else None
        } for member in members]

        return jsonify(result)
    except Exception as e:
        logger.error(f"Error while retrieving members: {str(e)}")
        return jsonify({
            "error": "Database Error",
            "message": str(e),
            "type": type(e).__name__
        }), 500

@members_bp.route("/<int:id>")
def get_member(id):
    try:
        member = User.query.filter_by(user_id=id, user_role='membre').first_or_404()

        result = {
            "id": member.user_id,
            "lastname": member.lastname,
            "firstname": member.firstname,
            "email": member.mail,
            "status": member.user_status,
            "creation_date": member.creation_date.isoformat() if member.creation_date else None
        }

        return jsonify(result)
    except Exception as e:
        logger.error(f"Error while retrieving member {id}: {str(e)}")
        return jsonify({
            "error": "Database Error",
            "message": str(e)
        }), 500

@members_bp.route("/<int:id>", methods=['PUT'])
def update_member(id):
    try:
        member = User.query.filter_by(user_id=id, user_role='membre').first_or_404()
        data = request.get_json()

        if 'lastname' in data:
            member.lastname = data['lastname']
        if 'firstname' in data:
            member.firstname = data['firstname']
        if 'email' in data:
            member.mail = data['email']
        if 'status' in data:
            if data['status'] in ['actif', 'inactif', 'suspendu']:
                member.user_status = data['status']
            else:
                return jsonify({
                    "error": "Validation Error",
                    "message": "Invalid status value"
                }), 400

        db.session.commit()

        return jsonify({
            "message": "Member updated successfully",
            "id": member.user_id
        })
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error while updating member {id}: {str(e)}")
        return jsonify({
            "error": "Database Error",
            "message": str(e)
        }), 500

@members_bp.route("/<int:id>", methods=['DELETE'])
def delete_member(id):
    try:
        member = User.query.filter_by(user_id=id, user_role='membre').first_or_404()

        db.session.delete(member)
        db.session.commit()

        return jsonify({
            "message": "Member deleted successfully",
            "id": id
        })
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error while deleting member {id}: {str(e)}")
        return jsonify({
            "error": "Database Error",
            "message": str(e)
        }), 500