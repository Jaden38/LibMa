from app import app, db
from app.models import User
from flask import jsonify, request, Blueprint
import logging

logger = logging.getLogger(__name__)
librarians_bp = Blueprint('libraires', __name__)

@librarians_bp.route("/")
def get_librarians():
    try:
        librarians = User.query.filter_by(user_role='bibliothecaire').all()
        logger.debug(f"Number of librarians found: {len(librarians)}")

        result = [{
            "id": librarian.user_id,
            "lastname": librarian.lastname,
            "firstname": librarian.firstname,
            "email": librarian.mail,
            "status": librarian.user_status,
            "creation_date": librarian.creation_date.isoformat() if librarian.creation_date else None
        } for librarian in librarians]

        return jsonify(result)
    except Exception as e:
        logger.error(f"Error while retrieving librarians: {str(e)}")
        return jsonify({
            "error": "Database Error",
            "message": str(e),
            "type": type(e).__name__
        }), 500


@librarians_bp.route("/<int:id>")
def get_librarian(id):
    try:
        librarian = User.query.filter_by(user_id=id, user_role='bibliothecaire').first_or_404()

        result = {
            "id": librarian.user_id,
            "lastname": librarian.lastname,
            "firstname": librarian.firstname,
            "email": librarian.mail,
            "status": librarian.user_status,
            "creation_date": librarian.creation_date.isoformat() if librarian.creation_date else None
        }

        return jsonify(result)
    except Exception as e:
        logger.error(f"Error while retrieving librarian {id}: {str(e)}")
        return jsonify({
            "error": "Database Error",
            "message": str(e)
        }), 500


@librarians_bp.route("/<int:id>", methods=['PUT'])
def update_librarian(id):
    try:
        librarian = User.query.filter_by(user_id=id, user_role='bibliothecaire').first_or_404()
        data = request.get_json()

        if 'lastname' in data:
            librarian.lastname = data['lastname']
        if 'firstname' in data:
            librarian.firstname = data['firstname']
        if 'email' in data:
            librarian.mail = data['email']
        if 'status' in data:
            if data['status'] in ['actif', 'inactif', 'suspendu']:
                librarian.user_status = data['status']
            else:
                return jsonify({
                    "error": "Validation Error",
                    "message": "Invalid status value"
                }), 400

        db.session.commit()

        return jsonify({
            "message": "Librarian updated successfully",
            "id": librarian.user_id
        })
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error while updating librarian {id}: {str(e)}")
        return jsonify({
            "error": "Database Error",
            "message": str(e)
        }), 500


@librarians_bp.route("/<int:id>", methods=['DELETE'])
def delete_librarian(id):
    try:
        librarian = User.query.filter_by(user_id=id, user_role='bibliothecaire').first_or_404()

        db.session.delete(librarian)
        db.session.commit()

        return jsonify({
            "message": "Librarian deleted successfully",
            "id": id
        })
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error while deleting librarian {id}: {str(e)}")
        return jsonify({
            "error": "Database Error",
            "message": str(e)
        }), 500