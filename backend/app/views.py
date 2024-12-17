from app import app, db
from app.models import Book, Sample, Borrow, Notification
from flask import jsonify
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


@app.route("/livres")
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
                "release_date": (
                    book.release_date.isoformat() if book.release_date else None
                ),
                "description": book.book_description,
            }
            for book in books
        ]

        return jsonify(result)
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des livres: {str(e)}")
        return (
            jsonify(
                {"error": "Erreur DB", "message": str(e), "type": type(e).__name__}
            ),
            500,
        )


@app.route("/livres/<int:id>")
def get_book(id):
    try:
        livre = Book.query.get_or_404(id)
        result = {
            "id": livre.book_id,
            "title": livre.title,
            "author": livre.author,
            "genre": livre.genre,
            "category": livre.category,
            "release_date": (
                livre.release_date.isoformat() if livre.release_date else None
            ),
            "description": livre.book_description,
            "image_url": livre.image_url,
        }
        return jsonify(result)
    except Exception as e:
        logger.error(f"Erreur lors de la récupération du livre {id}: {str(e)}")
        return jsonify({"error": "Erreur DB", "message": str(e)}), 500


@app.route("/livres/<int:id>/exemplaires")
def get_sample(id):
    try:
        book = Book.query.get_or_404(id)
        samples = Sample.query.filter_by(book_id=id).all()
        logger.debug(f"Nombre d'exemplaires trouvés pour le livre {id}: {len(samples)}")

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
        logger.error(
            f"Erreur lors de la récupération des samples du livre {id}: {str(e)}"
        )
        return (
            jsonify(
                {"error": "Erreur DB", "message": str(e), "type": type(e).__name__}
            ),
            500,
        )


@app.route("/exemplaires/<int:id>/emprunts")
def get_borrowed_sample(id):
    try:
        borrows = (
            Borrow.query.filter_by(sample_id=id)
            .order_by(Sample.begin_date.desc())
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
        logger.error(
            f"Erreur lors de la récupération des emprunts de l'sample {id}: {str(e)}"
        )
        return jsonify({"error": "Erreur de DB:", "message": str(e)}), 500


@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
    return response


@app.errorhandler(404)
def not_found_error(error):
    return (
        jsonify(
            {"error": "Not Found", "message": "La ressource demandée n'existe pas"}
        ),
        404,
    )


@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return (
        jsonify(
            {
                "error": "Internal Server Error",
                "message": "Une erreur interne est survenue",
            }
        ),
        500,
    )


@app.route('/notifications/<int:user_id>')
def get_user_notifications(user_id):
    try:
        notifications = Notification.query.filter_by(
            user_id=user_id,
            viewed=False
        ).order_by(
            Notification.creation_date.desc()
        ).all()

        result = [{
            'id': notif.notification_id,
            'type': notif.notification_type,
            'message': notif.notification_message,
            'creation_date': notif.creation_date.isoformat(),
            'viewed': bool(notif.viewed)
        } for notif in notifications]

        return jsonify(result)
    except Exception as e:
        return jsonify({'error': 'Database error', 'message': str(e)}), 500

@app.route('/notifications/<int:notification_id>/mark-read', methods=['POST'])
def mark_notification_read(notification_id):
    try:
        notification = Notification.query.get_or_404(notification_id)
        notification.viewed = True
        db.session.commit()
        return jsonify({'message': 'Notification marked as read'})
    except Exception as e:
        return jsonify({'error': 'Database error', 'message': str(e)}), 500