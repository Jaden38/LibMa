-- Table des Utilisateurs
CREATE TABLE IF NOT EXISTS Utilisateurs (
    id_utilisateur SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    mail VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role ENUM('membre', 'bibliothécaire', 'administrateur') NOT NULL,
    statut ENUM('actif', 'inactif', 'suspendu') DEFAULT 'actif'
);

-- Table des Livres (Catalogue)
CREATE TABLE IF NOT EXISTS Livres (
    id_livre SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    auteur VARCHAR(255) NOT NULL,
    genre VARCHAR(100),
    categorie VARCHAR(100),
    date_sortie DATE,
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image_url VARCHAR(255),
    description TEXT
);

-- Table des Exemplaires de Livres
CREATE TABLE IF NOT EXISTS Exemplaires (
    id_exemplaire SERIAL PRIMARY KEY,
    id_livre INTEGER REFERENCES Livres(id_livre),
    code_unique VARCHAR(50) UNIQUE NOT NULL,
    statut ENUM('disponible', 'emprunté', 'réservé', 'indisponible') DEFAULT 'disponible',
    date_acquisition DATE,
    localisation VARCHAR(100)
);

-- Table des Emprunts
CREATE TABLE IF NOT EXISTS Emprunts (
    id_emprunt SERIAL PRIMARY KEY,
    id_utilisateur INTEGER REFERENCES Utilisateurs(id_utilisateur),
    id_exemplaire INTEGER REFERENCES Exemplaires(id_exemplaire),
    date_reservation TIMESTAMP,
    date_debut TIMESTAMP NOT NULL,
    date_fin TIMESTAMP NOT NULL,
    date_retour TIMESTAMP,
    statut ENUM('en cours', 'terminé', 'en retard', 'annulé') NOT NULL,
    approuve_par INTEGER REFERENCES Utilisateurs(id_utilisateur)
);

-- Table des Réservations
CREATE TABLE IF NOT EXISTS Reservations (
    id_reservation SERIAL PRIMARY KEY,
    id_utilisateur INTEGER REFERENCES Utilisateurs(id_utilisateur),
    id_livre INTEGER REFERENCES Livres(id_livre),
    date_reservation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut ENUM('active', 'confirmée', 'annulée', 'expirée') NOT NULL,
    date_expiration TIMESTAMP
);

-- Table des Notifications
CREATE TABLE IF NOT EXISTS Notifications (
    id_notification SERIAL PRIMARY KEY,
    id_utilisateur INTEGER REFERENCES Utilisateurs(id_utilisateur),
    type ENUM('rappel_emprunt', 'nouvelle_reservation', 'date_echeance') NOT NULL,
    message TEXT NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lu BOOLEAN DEFAULT FALSE
);

-- Table des Logs (Historique)
CREATE TABLE IF NOT EXISTS Logs (
    id_log SERIAL PRIMARY KEY,
    id_utilisateur INTEGER REFERENCES Utilisateurs(id_utilisateur),
    action VARCHAR(255) NOT NULL,
    details TEXT,
    date_action TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour optimiser les performances
CREATE INDEX idx_livres_titre ON Livres(titre);
CREATE INDEX idx_livres_auteur ON Livres(auteur);
CREATE INDEX idx_exemplaires_statut ON Exemplaires(statut);
CREATE INDEX idx_emprunts_utilisateur ON Emprunts(id_utilisateur);
CREATE INDEX idx_emprunts_statut ON Emprunts(statut);