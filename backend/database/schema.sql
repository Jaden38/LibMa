USE library_db;

CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lastname VARCHAR(100) NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    mail VARCHAR(255) UNIQUE NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_role ENUM('membre', 'bibliothecaire', 'administrateur') NOT NULL,
    user_status ENUM('actif', 'inactif', 'suspendu') DEFAULT 'actif'
);

CREATE TABLE IF NOT EXISTS books (
    book_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    genre VARCHAR(100),
    category VARCHAR(100),
    book_description TEXT,
    release_date DATE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image_url VARCHAR(255),
    INDEX index_books_title (title),
    INDEX index_books_author (author)
);

CREATE TABLE IF NOT EXISTS samples (
    sample_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    book_id BIGINT,
    unique_code VARCHAR(50) UNIQUE NOT NULL,
    sample_status ENUM('disponible', 'emprunté', 'réservé', 'indisponible') DEFAULT 'disponible',
    procurement_date DATE,
    localization VARCHAR(100),
    INDEX index_sample_status (sample_status),
    CONSTRAINT fk_samples_books 
        FOREIGN KEY (book_id) 
        REFERENCES books(book_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS borrows (
    borrow_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    sample_id BIGINT,
    borrowed_at TIMESTAMP,
    begin_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    returned_at TIMESTAMP,
    borrow_status ENUM('en cours', 'terminé', 'en retard', 'annulé') NOT NULL,
    approved_by BIGINT,
    INDEX index_user_borrows (user_id),
    INDEX index_borrow_status (borrow_status),
    CONSTRAINT fk_borrows_users
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_borrows_samples
        FOREIGN KEY (sample_id)
        REFERENCES samples(sample_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_borrows_approved_by
        FOREIGN KEY (approved_by)
        REFERENCES users(user_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS reservations (
    reservation_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    book_id BIGINT,
    borrowed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reservation_status ENUM('active', 'confirmée', 'annulée', 'expirée') NOT NULL,
    expiration_date TIMESTAMP,
    CONSTRAINT fk_reservations_users
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_reservations_books
        FOREIGN KEY (book_id)
        REFERENCES books(book_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
    notification_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    notification_type ENUM('rappel_emprunt', 'nouvelle_reservation', 'date_echeance') NOT NULL,
    notification_message TEXT NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    viewed BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_notifications_users
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS logs (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    log_action VARCHAR(255) NOT NULL,
    log_details TEXT,
    action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_logs_users
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);