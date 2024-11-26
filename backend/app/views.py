from flask import render_template, jsonify
from app import app, db
from app.models import Livre
import logging
from sqlalchemy import text

# Configuration du logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


@app.route('/livres')
def getLivres():
    try:
        # Utiliser text() pour les requêtes SQL brutes
        livres = Livre.query.all()
        logger.debug(f"Nombre de livres trouvés : {len(livres)}")
        result = [{
            'id_livre': livre.id_livre,
            'titre': livre.titre,
            'auteur': livre.auteur,
            'genre': livre.genre,
            'categorie': livre.categorie,
            'date_sortie': livre.date_sortie.isoformat() if livre.date_sortie else None,
            'description': livre.description
        } for livre in livres]

        return jsonify(result)
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des livres: {str(e)}")
        return jsonify({
            'error': 'Database error',
            'message': str(e),
            'type': type(e).__name__
        }), 500


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin',
                         'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods',
                         'GET,PUT,POST,DELETE,OPTIONS')
    return response
