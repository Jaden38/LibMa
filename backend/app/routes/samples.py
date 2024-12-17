from flask import Blueprint, jsonify
from app import db
from app.models import Borrow, Sample
import logging

logger = logging.getLogger(__name__)
samples_bp = Blueprint('samples', __name__)

@samples_bp.route("/<int:id>/emprunts")
def get_borrowed_sample(id):
    try:
        borrows = Borrow.query.filter_by(sample_id=id).order_by(Sample.begin_date.desc()).all()
        result = [
            {
                "id": borrow.borrow_id,
                "begin_date": borrow.begin_date.isoformat(),
                "end_date": borrow.end_date.isoformat(),
                "return_date": borrow.return_date.isoformat() if borrow.return_date else None,
                "status": borrow.status,
                "user": {
                    "id": borrow.user.id_user,
                    "lastname": borrow.user.nom,
                    "firstname": borrow.user.prenom,
                },
            }
            for borrow in borrows
        ]
        return jsonify(result)
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des emprunts de l'sample {id}: {str(e)}")
        return jsonify({"error": "Erreur de DB:", "message": str(e)}), 500