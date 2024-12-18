from flask import Blueprint, jsonify, request
from app import db
from app.models import Borrow, User, Book, Sample
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
borrows_bp = Blueprint("borrows", __name__)


def format_book_data(sample):
    book = sample.book
    return {
        "id": book.book_id,
        "title": book.title,
        "author": book.author,
        "genre": book.genre,
        "category": book.category,
        "release_date": book.release_date.isoformat() if book.release_date else None,
        "description": book.book_description,
        "cover_image": book.cover_image
    }
def format_sample_data(sample):
    return {
        "sample_id": sample.sample_id,
        "book": format_book_data(sample),
        "unique_code": sample.unique_code,
        "sample_status": sample.sample_status,
        "procurement_date": sample.procurement_date,
        "localization": sample.localization,
}

def format_borrow_data(borrow):
    return {
        "id": borrow.borrow_id,
        "begin_date": borrow.begin_date.isoformat() if borrow.begin_date else None,
        "end_date": borrow.end_date.isoformat() if borrow.end_date else None,
        "status": borrow.borrow_status,
        "return_date": borrow.returned_at.isoformat() if borrow.returned_at else None,
        "user": {
            "id": borrow.user1.user_id,
            "lastname": borrow.user1.lastname,
            "firstname": borrow.user1.firstname,
        },
        "sample": format_sample_data(borrow.sample),
        "approved_by" : borrow.approved_by,
    }


@borrows_bp.route("/")
def get_borrows():
    try:
        borrows = Borrow.query.order_by(Borrow.begin_date.desc()).all()
        logger.debug(f"Number of borrows found: {len(borrows)}")

        result = [format_borrow_data(borrow) for borrow in borrows]
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error while retrieving borrows: {str(e)}")
        return (
            jsonify(
                {"error": "Database Error", "message": str(e), "type": type(e).__name__}
            ),
            500,
        )


@borrows_bp.route("/<int:id>")
def get_borrow(id):
    try:
        borrow = Borrow.query.get_or_404(id)
        return jsonify(format_borrow_data(borrow))
    except Exception as e:
        logger.error(f"Error while retrieving borrow {id}: {str(e)}")
        return jsonify({"error": "Database Error", "message": str(e)}), 500


@borrows_bp.route("/", methods=["POST"])
def create_borrow():
    try:
        data = request.get_json()
        required_fields = ["user_id", "sample_id", "begin_date", "end_date"]
        for field in required_fields:
            if field not in data:
                return (
                    jsonify(
                        {
                            "error": "Validation Error",
                            "message": f"Missing required field: {field}",
                        }
                    ),
                    400,
                )

        sample = Sample.query.get_or_404(data["sample_id"])
        existing_active_borrows = Borrow.query.filter_by(
            sample_id=data["sample_id"], borrow_status="en cours"
        ).first()

        if existing_active_borrows:
            return (
                jsonify(
                    {
                        "error": "Validation Error",
                        "message": "This sample is already borrowed",
                    }
                ),
                400,
            )

        new_borrow = Borrow(
            user_id=data["user_id"],
            sample_id=data["sample_id"],
            begin_date=datetime.fromisoformat(data["begin_date"]),
            end_date=datetime.fromisoformat(data["end_date"]),
            borrowed_at=datetime.now(),
            borrow_status="en cours",
            approved_by=data.get("approved_by"),
        )

        db.session.add(new_borrow)
        db.session.commit()

        return jsonify(format_borrow_data(new_borrow)), 201
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error while creating borrow: {str(e)}")
        return jsonify({"error": "Database Error", "message": str(e)}), 500


@borrows_bp.route("/<int:id>", methods=["PUT"])
def update_borrow(id):
    try:
        borrow = Borrow.query.get_or_404(id)
        data = request.get_json()
        sample = Sample.query.get(borrow.sample_id)

        if "begin_date" in data:
            borrow.begin_date = datetime.fromisoformat(data["begin_date"])
        if "end_date" in data:
            borrow.end_date = datetime.fromisoformat(data["end_date"])
        if "status" in data:
            if data["status"] in ["en cours", "terminé", "en retard", "annulé"]:
                borrow.borrow_status = data["status"]

                if data["status"] == "annulé" and sample:
                    sample.sample_status = "disponible"
            else:
                return (
                    jsonify(
                        {"error": "Validation Error", "message": "Invalid status value"}
                    ),
                    400,
                )
        if "return_date" in data and data["return_date"]:
            borrow.returned_at = datetime.fromisoformat(data["return_date"])
            borrow.borrow_status = "terminé"
            if sample:
                sample.sample_status = "disponible"

        db.session.commit()
        return jsonify(format_borrow_data(borrow))
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error while updating borrow {id}: {str(e)}")
        return jsonify({"error": "Database Error", "message": str(e)}), 500


@borrows_bp.route("/<int:id>/approve", methods=["PATCH"])
def approve_borrow(id):
    try:
        borrow = Borrow.query.get_or_404(id)

        # Vérifier si l'emprunt n'a pas déjà été approuvé ou rejeté
        if borrow.approved_by is not None:
            return (
                jsonify(
                    {
                        "error": "Validation Error",
                        "message": "Cette demande d'emprunt a déjà été traitée",
                    }
                ),
                400,
            )

        sample = Sample.query.get(borrow.sample_id)
        if sample.sample_status != "disponible":
            return (
                jsonify(
                    {
                        "error": "Validation Error",
                        "message": "L'exemplaire n'est plus disponible",
                    }
                ),
                400,
            )

        borrow.approved_by = (
            request.get_json()['approved_by']
        )
        borrow.borrow_status = "en cours"

        sample.sample_status = "emprunté"

        db.session.commit()

        return jsonify(format_borrow_data(borrow))

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error while approving borrow {id}: {str(e)}")
        return jsonify({"error": "Database Error", "message": str(e)}), 500


@borrows_bp.route("/<int:id>/reject", methods=["PATCH"])
def reject_borrow(id):
    try:
        borrow = Borrow.query.get_or_404(id)

        # Vérifier si l'emprunt n'a pas déjà été approuvé ou rejeté
        if borrow.approved_by is not None:
            return (
                jsonify(
                    {
                        "error": "Validation Error",
                        "message": "Cette demande d'emprunt a déjà été traitée",
                    }
                ),
                400,
            )

        # Mettre à jour le statut de l'emprunt
        borrow.borrow_status = "annulé"
        borrow.approved_by = (
            request.get_json()['approved_by']
        )

        db.session.commit()

        return jsonify(format_borrow_data(borrow))

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error while rejecting borrow {id}: {str(e)}")
        return jsonify({"error": "Database Error", "message": str(e)}), 500


@borrows_bp.route("/<int:id>", methods=["DELETE"])
def delete_borrow(id):
    try:
        borrow = Borrow.query.get_or_404(id)
        borrow.borrow_status = "annulé"
        db.session.commit()

        return jsonify({"message": "Borrow cancelled successfully", "id": id})
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error while cancelling borrow {id}: {str(e)}")
        return jsonify({"error": "Database Error", "message": str(e)}), 500
