from flask import render_template, jsonify
from app import app, db
from app.models import Livre, Exemplaire, Emprunt
import logging
from sqlalchemy import text

# Configuration du logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@app.route('/livres')
def getLivres():
    try:
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

@app.route('/livres/<int:id>')
def getLivre(id):
    try:
        livre = Livre.query.get_or_404(id)
        result = {
            'id_livre': livre.id_livre,
            'titre': livre.titre,
            'auteur': livre.auteur,
            'genre': livre.genre,
            'categorie': livre.categorie,
            'date_sortie': livre.date_sortie.isoformat() if livre.date_sortie else None,
            'description': livre.description,
            'image_url': livre.image_url
        }
        return jsonify(result)
    except Exception as e:
        logger.error(f"Erreur lors de la récupération du livre {id}: {str(e)}")
        return jsonify({'error': 'Database error', 'message': str(e)}), 500

@app.route('/livres/<int:id>/exemplaires')
def getExemplaires(id):
    try:
        # Vérifier d'abord si le livre existe
        livre = Livre.query.get_or_404(id)
        
        # Récupérer tous les exemplaires du livre
        exemplaires = Exemplaire.query.filter_by(id_livre=id).all()
        logger.debug(f"Nombre d'exemplaires trouvés pour le livre {id}: {len(exemplaires)}")
        
        result = [{
            'id_exemplaire': exemplaire.id_exemplaire,
            'code_unique': exemplaire.code_unique,
            'statut': exemplaire.statut,
            'date_acquisition': exemplaire.date_acquisition.isoformat() if exemplaire.date_acquisition else None,
            'localisation': exemplaire.localisation
        } for exemplaire in exemplaires]
        
        return jsonify(result)
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des exemplaires du livre {id}: {str(e)}")
        return jsonify({
            'error': 'Database error',
            'message': str(e),
            'type': type(e).__name__
        }), 500


@app.route('/exemplaires/<int:id>/emprunts')
def getExemplaireEmprunts(id):
    try:
        exemplaire = Exemplaire.query.get_or_404(id)
        emprunts = Emprunt.query.filter_by(id_exemplaire=id).order_by(Emprunt.date_debut.desc()).all()
        
        result = [{
            'id_emprunt': emprunt.id_emprunt,
            'date_debut': emprunt.date_debut.isoformat(),
            'date_fin': emprunt.date_fin.isoformat(),
            'date_retour': emprunt.date_retour.isoformat() if emprunt.date_retour else None,
            'statut': emprunt.statut,
            'utilisateur': {
                'id': emprunt.utilisateur.id_utilisateur,
                'nom': emprunt.utilisateur.nom,
                'prenom': emprunt.utilisateur.prenom
            }
        } for emprunt in emprunts]
        
        return jsonify(result)
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des emprunts de l'exemplaire {id}: {str(e)}")
        return jsonify({
            'error': 'Database error',
            'message': str(e)
        }), 500
        
# Gestion des en-têtes CORS
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Gestion des erreurs 404
@app.errorhandler(404)
def not_found_error(error):
    return jsonify({
        'error': 'Not Found',
        'message': 'La ressource demandée n\'existe pas'
    }), 404

# Gestion des erreurs 500
@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()  # En cas d'erreur de base de données
    return jsonify({
        'error': 'Internal Server Error',
        'message': 'Une erreur interne est survenue'
    }), 500