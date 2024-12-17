from flask import Blueprint, jsonify
from app import db
from app.models import Book, Sample
import logging

logger = logging.getLogger(__name__)
books_bp = Blueprint('books', __name__)

@books_bp.route("/")
def get_books():
    try:
        books = Book.query.all()
        logger.debug(f"Nombre de livres trouvés : {len(books)}")
        result = [
            {
                "id": book.book_id,
                "title": book.title,
                "author": book.author,
                "genre": book.genre,
                "category": book.category,
                "release_date": book.release_date.isoformat() if book.release_date else None,
                "description": book.book_description,
            }
            for book in books
        ]
        return jsonify(result)
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des livres: {str(e)}")
        return jsonify({"error": "Erreur DB", "message": str(e), "type": type(e).__name__}), 500

@books_bp.route("/<int:id>")
def get_book(id):
    try:
        livre = Book.query.get_or_404(id)
        result = {
            "id": livre.book_id,
            "title": livre.title,
            "author": livre.author,
            "genre": livre.genre,
            "category": livre.category,
            "release_date": livre.release_date.isoformat() if livre.release_date else None,
            "description": livre.book_description,
            "image_url": livre.image_url,
        }
        return jsonify(result)
    except Exception as e:
        logger.error(f"Erreur lors de la récupération du livre {id}: {str(e)}")
        return jsonify({"error": "Erreur DB", "message": str(e)}), 500
    
@books_bp.route("/<int:id>/exemplaires")
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