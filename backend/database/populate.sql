INSERT INTO users (lastname, firstname, mail, user_password, user_role, user_status) VALUES
('Admin', 'Admin', 'admin@gmail.com', 'scrypt:32768:8:1$n3dRFnd6XULMZt0n$c345f586950016730f26c804548e12776483765f55519925e423e16b021bb89862f90a24154a308f0758a3e3e843ae8a1959c4e5ad84d1cd016368493b54566f', 'administrateur', 'actif'),
('Bibliothecaire', 'Bibliothecaire', 'bibliothecaire@gmail.com', 'scrypt:32768:8:1$iOee5CH47C68i5yJ$95be8d3182cd7bab66bb22dddd68041a07077c31fa9f3b305d9329bb5ed6372e81455682f5a6e300e5c6b72d3cc16a50a277269e45d79738ec4381ab4f2734c3', 'bibliothécaire', 'actif'),
('Dubois', 'Jean', 'jean.dubois@email.com', 'hashed_password_1', 'bibliothécaire', 'actif'),
('Martin', 'Sophie', 'sophie.martin@email.com', 'hashed_password_2', 'bibliothécaire', 'actif'),
('Bernard', 'Michel', 'michel.bernard@email.com', 'hashed_password_3', 'bibliothécaire', 'actif'),
('Petit', 'Marie', 'marie.petit@email.com', 'hashed_password_4', 'membre', 'actif'),
('Robert', 'Lucas', 'lucas.robert@email.com', 'hashed_password_5', 'membre', 'actif'),
('Moreau', 'Emma', 'emma.moreau@email.com', 'hashed_password_6', 'membre', 'suspendu'),
('Richard', 'Thomas', 'thomas.richard@email.com', 'hashed_password_7', 'membre', 'actif'),
('Laurent', 'Julie', 'julie.laurent@email.com', 'hashed_password_8', 'membre', 'actif');

INSERT INTO books (title, author, genre, category, release_date, book_description) VALUES
('Les Misérables', 'Victor Hugo', 'Roman', 'Classique', '1862-01-01', 'Une épopée sociale dans la France du XIXe siècle'),
('1984', 'George Orwell', 'Science-Fiction', 'Dystopie', '1949-06-08', 'Une vision effrayante d''un futur totalitaire'),
('Le Petit Prince', 'Antoine de Saint-Exupéry', 'Conte', 'Jeunesse', '1943-04-06', 'Un conte poétique et philosophique'),
('L''Étranger', 'Albert Camus', 'Roman', 'Philosophie', '1942-01-01', 'Un roman existentialiste majeur'),
('Harry Potter à l''école des sorciers', 'J.K. Rowling', 'Fantasy', 'Jeunesse', '1997-06-26', 'Le début d''une saga magique'),
('Le Comte de Monte-Cristo', 'Alexandre Dumas', 'Roman', 'Aventure', '1844-01-01', 'Une histoire de vengeance et de rédemption'),
('Candide', 'Voltaire', 'Conte philosophique', 'Classique', '1759-01-01', 'Une satire philosophique'),
('Notre-Dame de Paris', 'Victor Hugo', 'Roman', 'Classique', '1831-01-01', 'Une fresque historique médiévale'),
('L''Illiade', 'Homère', 'Épopée', 'Classique', '1200-01-01', 'Une légende épique de la guerre de Troie'),
('L''Odyssée', 'Homère', 'Épopée', 'Classique', '1200-01-01', 'L''aventure du héros Ulysse en quête de retour'),
('Germinal', 'Émile Zola', 'Roman', 'Naturaliste', '1885-01-01', 'Une description poignante du monde ouvrier'),
('Crime et Châtiment', 'Fiodor Dostoïevski', 'Roman', 'Psychologique', '1866-01-01', 'Le dilemme moral d''un meurtrier'),
('Anna Karénine', 'Léon Tolstoï', 'Roman', 'Drame', '1877-01-01', 'Une analyse des conflits humains et des passions'),
('La Métamorphose', 'Franz Kafka', 'Roman', 'Absurdiste', '1915-01-01', 'Un homme transformé en insecte face à la société'),
('Don Quichotte', 'Miguel de Cervantes', 'Roman', 'Classique', '1605-01-01', 'Les aventures burlesques d''un chevalier fou'),
('Les Fleurs du mal', 'Charles Baudelaire', 'Poésie', 'Classique', '1857-01-01', 'Une exploration des thèmes de beauté et de décadence'),
('À la recherche du temps perdu', 'Marcel Proust', 'Roman', 'Classique', '1913-01-01', 'Un chef-d''œuvre littéraire explorant la mémoire et le temps'),
('Le Seigneur des Anneaux', 'J.R.R. Tolkien', 'Fantasy', 'Épopée', '1954-07-29', 'Un voyage épique dans la Terre du Milieu'),
('Fahrenheit 451', 'Ray Bradbury', 'Science-Fiction', 'Dystopie', '1953-10-19', 'Une critique de la censure et de la société'),
('Moby Dick', 'Herman Melville', 'Roman', 'Aventure', '1851-01-01', 'Une chasse obsédante à la baleine blanche'),
('Le Rouge et le Noir', 'Stendhal', 'Roman', 'Classique', '1830-01-01', 'Une réflexion sur l''ambition et l''amour'),
('Madame Bovary', 'Gustave Flaubert', 'Roman', 'Classique', '1857-01-01', 'Les désillusions d''une femme romantique'),
('Le Vieil Homme et la Mer', 'Ernest Hemingway', 'Roman', 'Aventure', '1952-01-01', 'Une lutte poignante entre l''homme et la nature'),
('Dracula', 'Bram Stoker', 'Roman', 'Horreur', '1897-01-01', 'Une exploration du mythe du vampire'),
('Frankenstein', 'Mary Shelley', 'Roman', 'Science-Fiction', '1818-01-01', 'La création et l''isolement d''un être artificiel'),
('Les Hauts de Hurlevent', 'Emily Brontë', 'Roman', 'Gothique', '1847-01-01', 'Une tragédie passionnelle dans les landes anglaises'),
('Orgueil et Préjugés', 'Jane Austen', 'Roman', 'Romance', '1813-01-01', 'Les relations et les préjugés de la société anglaise'),
('Dune', 'Frank Herbert', 'Science-Fiction', 'Épopée', '1965-08-01', 'Une saga intergalactique sur le pouvoir et la survie'),
('Le Nom de la Rose', 'Umberto Eco', 'Roman', 'Historique', '1980-01-01', 'Un polar médiéval dans une abbaye bénédictine');

INSERT INTO samples (book_id, unique_code, sample_status, procurement_date, localization) VALUES
(1, 'LM001', 'disponible', '2023-01-15', 'Étagère A1'),
(1, 'LM002', 'emprunté', '2023-01-15', 'Étagère A1'),
(2, '1984001', 'disponible', '2023-02-20', 'Étagère B2'),
(3, 'PP001', 'disponible', '2023-03-10', 'Étagère C3'),
(4, 'ETR001', 'réservé', '2023-04-05', 'Étagère D4'),
(5, 'HP001', 'emprunté', '2023-05-12', 'Étagère E5'),
(6, 'CMC001', 'disponible', '2023-06-18', 'Étagère F6'),
(7, 'CAN001', 'indisponible', '2023-07-22', 'Réparation');

INSERT INTO borrows (user_id, sample_id, begin_date, end_date, returned_at, borrow_status, approved_by) VALUES
(4, 2, '2024-01-01', '2024-01-15', NULL, 'en cours', 2),
(5, 5, '2024-01-05', '2024-01-19', NULL, 'en cours', 2),
(7, 6, '2023-12-15', '2023-12-29', '2023-12-28', 'terminé', 3),
(4, 3, '2023-12-01', '2023-12-15', '2023-12-18', 'en retard', 2),
(8, 1, '2023-11-20', '2023-12-04', '2023-12-04', 'terminé', 2);

INSERT INTO reservations (user_id, book_id, reservation_status, expiration_date) VALUES
(5, 3, 'active', '2024-02-01'),
(6, 2, 'annulée', '2024-01-15'),
(7, 4, 'confirmée', '2024-02-05'),
(8, 1, 'active', '2024-02-10');

INSERT INTO notifications (user_id, notification_type, notification_message) VALUES
(4, 'rappel_emprunt', 'Votre emprunt arrive à échéance dans 2 jours.'),
(5, 'nouvelle_reservation', 'Votre réservation a été confirmée.'),
(7, 'date_echeance', 'Un livre que vous avez réservé est maintenant disponible.'),
(8, 'rappel_emprunt', 'Merci de retourner votre livre dans les plus brefs délais.');

INSERT INTO logs (user_id, log_action, log_details) VALUES
(1, 'création_compte', 'Création d''un nouveau compte bibliothécaire'),
(2, 'validation_emprunt', 'Validation de l''emprunt #1'),
(3, 'ajout_livre', 'Ajout d''un nouveau livre au catalogue'),
(1, 'suspension_compte', 'Suspension du compte utilisateur #6'),
(2, 'retour_livre', 'Validation du retour de l''exemplaire #3');