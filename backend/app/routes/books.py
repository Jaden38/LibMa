from flask import Blueprint, jsonify
from app import db
from app.models import Book
import logging

logger = logging.getLogger(__name__)
books_bp = Blueprint('books', __name__)

@books_bp.route("/livres")
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

@books_bp.route("/livres/<int:id>")
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