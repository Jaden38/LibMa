"""
Example of adaptation of views.py

Notice that example not allow unconnected user to see library books

"""
from datetime import timezone,datetime

from flask import Blueprint, jsonify, request
from app import db
from app.models import Book, Sample, Borrow, User
from app.utils.decorators import require_auth, require_role
from sqlalchemy.orm import joinedload
import logging

# Create a blueprint for library-related routes
library_bp = Blueprint('library', __name__)

# Configure logging
logger = logging.getLogger(__name__)


@library_bp.route("/books")
@require_auth
def get_books():
    try:
        books = Book.query.all()
        logger.debug(f"Number of books found: {len(books)}")

        result = [
            {
                "id": book.book_id,
                "title": book.title,
                "author": book.author,
                "genre": book.genre,
                "category": book.category,
                "release_date": (
                    book.release_date.isoformat() if book.release_date else None
                ),
                "description": book.book_description,
            }
            for book in books
        ]

        return jsonify(result)
    except Exception as e:
        logger.error(f"Error retrieving books: {str(e)}")
        return jsonify({
            "error": "Database Error",
            "message": str(e),
            "type": type(e).__name__
        }), 500


@library_bp.route("/books/<int:id>")
@require_auth
def get_book(id):
    try:
        book = Book.query.get_or_404(id)
        result = {
            "id": book.book_id,
            "title": book.title,
            "author": book.author,
            "genre": book.genre,
            "category": book.category,
            "release_date": (
                book.release_date.isoformat() if book.release_date else None
            ),
            "description": book.book_description,
            "image_url": book.image_url,
        }
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error retrieving book {id}: {str(e)}")
        return jsonify({"error": "Database Error", "message": str(e)}), 500


@library_bp.route("/books/<int:id>/samples")
@require_auth
def get_book_samples(id):
    try:
        book = Book.query.get_or_404(id)
        samples = Sample.query.filter_by(book_id=id).all()
        logger.debug(f"Number of samples found for book {id}: {len(samples)}")

        result = [
            {
                "id": sample.sample_id,
                "unique_code": sample.unique_code,
                "status": sample.sample_status,
                "procurement_date": (
                    sample.procurement_date.isoformat()
                    if sample.procurement_date
                    else None
                ),
                "localization": sample.localization,
            }
            for sample in samples
        ]
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error retrieving samples for book {id}: {str(e)}")
        return jsonify({
            "error": "Database Error",
            "message": str(e),
            "type": type(e).__name__
        }), 500


@library_bp.route("/samples/<int:id>/borrows")
@require_role('librarian')
def get_sample_borrows(id):
    try:
        borrows = (
            Borrow.query
            .filter_by(sample_id=id)
            .order_by(Borrow.begin_date.desc())
            .options(joinedload(Borrow.user))
            .all()
        )
        result = [
            {
                "id": borrow.borrow_id,
                "begin_date": borrow.begin_date.isoformat(),
                "end_date": borrow.end_date.isoformat(),
                "return_date": (
                    borrow.return_date.isoformat() if borrow.return_date else None
                ),
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
        logger.error(f"Error retrieving borrows for sample {id}: {str(e)}")
        return jsonify({"error": "Database Error", "message": str(e)}), 500


# Add a new route for borrowing a book (example of a protected route)
@library_bp.route("/borrow", methods=['POST'])
@require_auth
def borrow_book():
    try:
        data = request.get_json()
        sample_id = data.get('sample_id')
        user_id = request.g.user_id  # Get user ID from the authenticated request

        # Check if sample exists and is available
        sample = Sample.query.get_or_404(sample_id)
        if sample.sample_status != 'available':
            return jsonify({"error": "Sample not available for borrowing"}), 400

        # Create new borrow record
        new_borrow = Borrow(
            sample_id=sample_id,
            user_id=user_id,
            begin_date=datetime.now(timezone.utc),
            status='active'
        )

        # Update sample status
        sample.sample_status = 'borrowed'

        db.session.add(new_borrow)
        db.session.commit()

        return jsonify({
            "message": "Book borrowed successfully",
            "borrow_id": new_borrow.borrow_id
        }), 201

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error borrowing book: {str(e)}")
        return jsonify({"error": "Borrowing failed", "message": str(e)}), 500


# Global error handlers can be moved to a separate error handling module
@library_bp.errorhandler(404)
def not_found_error(error):
    return jsonify({
        "error": "Not Found",
        "message": "The requested resource does not exist"
    }), 404


@library_bp.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({
        "error": "Internal Server Error",
        "message": "An internal error occurred"
    }), 500