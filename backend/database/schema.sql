use library_db;

CREATE TABLE IF NOT EXISTS Users (
    user_id SERIAL PRIMARY KEY,
    lastname VARCHAR(100) NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    mail VARCHAR(255) UNIQUE NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_role ENUM('membre', 'bibliothecaire', 'administrateur') NOT NULL,
    user_status ENUM('actif', 'inactif', 'suspendu') DEFAULT 'actif'
);

CREATE TABLE IF NOT EXISTS Books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    genre VARCHAR(100),
    category VARCHAR(100),
    book_description TEXT,
    release_date DATE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS Samples (
    sample_id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES Books(book_id),
    unique_code VARCHAR(50) UNIQUE NOT NULL,
    sample_status ENUM('disponible', 'emprunté', 'réservé', 'indisponible') DEFAULT 'disponible',
    procurement_date DATE,
    localization VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Borrows (
    borrow_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(user_id),
    sample_id INTEGER REFERENCES Samples(sample_id),
    borrowed_at TIMESTAMP,
    begin_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    returned_at TIMESTAMP,
    borrow_status ENUM('en cours', 'terminé', 'en retard', 'annulé') NOT NULL,
    approved_by INTEGER REFERENCES Users(user_id)
);

CREATE TABLE IF NOT EXISTS Reservations (
    reservation_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(user_id),
    book_id INTEGER REFERENCES Books(book_id),
    borrowed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reservation_status ENUM('active', 'confirmée', 'annulée', 'expirée') NOT NULL,
    expiration_date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(user_id),
    notification_type ENUM('rappel_emprunt', 'nouvelle_reservation', 'date_echeance') NOT NULL,
    notification_message TEXT NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    viewed BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS Logs (
    log_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(user_id),
    log_action VARCHAR(255) NOT NULL,
    log_details TEXT,
    action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX index_books_title ON Books(title);
CREATE INDEX index_books_author ON Books(author);
CREATE INDEX index_sample_status ON Samples(sample_status);
CREATE INDEX index_user_borrows ON Borrows(user_id);
CREATE INDEX index_borrow_status ON Borrows(borrow_status);