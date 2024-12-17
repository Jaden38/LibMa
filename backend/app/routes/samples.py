from flask import Blueprint, jsonify
from app import db
from app.models import Sample, Book
import logging

logger = logging.getLogger(__name__)
samples_bp = Blueprint('samples', __name__)

@samples_bp.route("/livres/<int:id>/exemplaires")
def get_samples(id):
    try:
        book = Book.query.get_or_404(id)
        samples = Sample.query.filter_by(book_id=id).all()
        logger.debug(f"Nombre d'exemplaires trouvés pour le livre {id}: {len(samples)}")

        result = [
            {
                "id": sample.sample_id,
                "unique_code": sample.unique_code,
                "status": sample.sample_status,
                "procurement_date": sample.procurement_date.isoformat() if sample.procurement_date else None,
                "localization": sample.localization,
            }
            for sample in samples
        ]
        return jsonify(result)
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des samples du livre {id}: {str(e)}")
        return jsonify({"error": "Erreur DB", "message": str(e), "type": type(e).__name__}), 500