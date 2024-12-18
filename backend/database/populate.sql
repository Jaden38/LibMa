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
(1, 'LM003', 'emprunté', '2023-03-20', 'Étagère A1'),
(1, 'LM004', 'disponible', '2023-05-10', 'Étagère A1'),
(2, '1984001', 'disponible', '2023-02-20', 'Étagère B2'),
(2, '1984002', 'emprunté', '2023-02-20', 'Étagère B2'),
(2, '1984003', 'indisponible', '2023-04-15', 'Atelier'),
(3, 'PP001', 'disponible', '2023-03-10', 'Étagère C3'),
(3, 'PP002', 'emprunté', '2023-03-10', 'Étagère C3'),
(4, 'ETR001', 'réservé', '2023-04-05', 'Étagère D4'),
(4, 'ETR002', 'emprunté', '2023-04-05', 'Étagère D4'),
(5, 'HP001', 'emprunté', '2023-05-12', 'Étagère E5'),
(5, 'HP002', 'emprunté', '2023-05-12', 'Étagère E5'),
(5, 'HP003', 'disponible', '2023-07-20', 'Étagère E5'),
(5, 'HP004', 'réservé', '2023-09-01', 'Étagère E5'),
(6, 'CMC001', 'disponible', '2023-06-18', 'Étagère F6'),
(6, 'CMC002', 'emprunté', '2023-06-18', 'Étagère F6'),
(6, 'CMC003', 'indisponible', '2023-08-30', 'Atelier'),
(7, 'CAN001', 'indisponible', '2023-07-22', 'Réparation'),
(8, 'NDP001', 'disponible', '2023-08-15', 'Étagère G7'),
(8, 'NDP002', 'emprunté', '2023-08-15', 'Étagère G7'),
(18, 'SDA001', 'disponible', '2023-09-10', 'Étagère H8'),
(18, 'SDA002', 'emprunté', '2023-09-10', 'Étagère H8'),
(18, 'SDA003', 'emprunté', '2023-09-10', 'Étagère H8'),
(28, 'DUNE001', 'disponible', '2023-10-05', 'Étagère I9'),
(28, 'DUNE002', 'réservé', '2023-10-05', 'Étagère I9'),
(3, 'PP003', 'disponible', '2023-05-15', 'Étagère C3'),
(3, 'PP004', 'indisponible', '2023-05-15', 'Atelier'),
(7, 'CAN002', 'disponible', '2023-07-22', 'Étagère F1'),
(7, 'CAN003', 'emprunté', '2023-07-22', 'Étagère F1'),
(9, 'ILL001', 'disponible', '2023-06-15', 'Étagère G2'),
(9, 'ILL002', 'emprunté', '2023-06-15', 'Étagère G2'),
(9, 'ILL003', 'réservé', '2023-06-15', 'Étagère G2'),
(10, 'ODY001', 'disponible', '2023-06-20', 'Étagère G3'),
(10, 'ODY002', 'emprunté', '2023-06-20', 'Étagère G3'),
(11, 'GER001', 'disponible', '2023-07-01', 'Étagère H1'),
(11, 'GER002', 'emprunté', '2023-07-01', 'Étagère H1'),
(11, 'GER003', 'indisponible', '2023-07-01', 'Atelier'),
(12, 'CRI001', 'disponible', '2023-07-10', 'Étagère H2'),
(12, 'CRI002', 'emprunté', '2023-07-10', 'Étagère H2'),
(13, 'ANN001', 'disponible', '2023-07-15', 'Étagère H3'),
(13, 'ANN002', 'réservé', '2023-07-15', 'Étagère H3'),
(13, 'ANN003', 'emprunté', '2023-07-15', 'Étagère H3'),
(14, 'MET001', 'disponible', '2023-08-01', 'Étagère I1'),
(14, 'MET002', 'emprunté', '2023-08-01', 'Étagère I1'),
(15, 'DON001', 'disponible', '2023-08-05', 'Étagère I2'),
(15, 'DON002', 'emprunté', '2023-08-05', 'Étagère I2'),
(15, 'DON003', 'réservé', '2023-08-05', 'Étagère I2'),
(16, 'FLE001', 'disponible', '2023-08-10', 'Étagère I3'),
(16, 'FLE002', 'indisponible', '2023-08-10', 'Atelier'),
(17, 'TEM001', 'disponible', '2023-08-15', 'Étagère J1'),
(17, 'TEM002', 'emprunté', '2023-08-15', 'Étagère J1'),
(17, 'TEM003', 'réservé', '2023-08-15', 'Étagère J1'),
(19, 'FAH001', 'disponible', '2023-09-01', 'Étagère K1'),
(19, 'FAH002', 'emprunté', '2023-09-01', 'Étagère K1'),
(20, 'MOB001', 'disponible', '2023-09-05', 'Étagère K2'),
(20, 'MOB002', 'emprunté', '2023-09-05', 'Étagère K2'),
(20, 'MOB003', 'indisponible', '2023-09-05', 'Atelier'),
(21, 'ROU001', 'disponible', '2023-09-10', 'Étagère K3'),
(21, 'ROU002', 'emprunté', '2023-09-10', 'Étagère K3'),
(22, 'BOV001', 'disponible', '2023-09-15', 'Étagère L1'),
(22, 'BOV002', 'réservé', '2023-09-15', 'Étagère L1'),
(23, 'VHM001', 'disponible', '2023-09-20', 'Étagère L2'),
(23, 'VHM002', 'emprunté', '2023-09-20', 'Étagère L2'),
(23, 'VHM003', 'réservé', '2023-09-20', 'Étagère L2'),
(24, 'DRA001', 'disponible', '2023-09-25', 'Étagère L3'),
(24, 'DRA002', 'emprunté', '2023-09-25', 'Étagère L3'),
(26, 'HAU001', 'disponible', '2023-10-05', 'Étagère M2'),
(26, 'HAU002', 'emprunté', '2023-10-05', 'Étagère M2'),
(27, 'ORG001', 'disponible', '2023-10-10', 'Étagère M3'),
(27, 'ORG002', 'emprunté', '2023-10-10', 'Étagère M3'),
(27, 'ORG003', 'réservé', '2023-10-10', 'Étagère M3'),
(28, 'DUNE003', 'emprunté', '2023-10-05', 'Étagère I9'),
(28, 'DUNE004', 'indisponible', '2023-10-05', 'Atelier');

INSERT INTO borrows (user_id, sample_id, begin_date, end_date, returned_at, borrow_status, approved_by) VALUES
(1, 4, '2024-01-02', '2024-01-16', NULL, 'en cours', 2), 
(1, 16, '2023-12-20', '2024-01-03', '2024-01-03', 'terminé', 3), 
(1, 21, '2023-12-15', '2023-12-29', '2023-12-28', 'terminé', 2),
(2, 1, '2024-01-08', '2024-01-22', NULL, 'en cours', 3),
(2, 5, '2023-12-10', '2023-12-24', '2023-12-23', 'terminé', 3),
(2, 23, '2024-01-05', '2024-01-19', NULL, 'en cours', 3),
(4, 2, '2024-01-01', '2024-01-15', NULL, 'en cours', 2),
(5, 5, '2024-01-24', '2024-01-30', NULL, 'en cours', 2),
(6, 8, '2024-01-07', '2024-01-21', NULL, 'en cours', 3),
(7, 11, '2024-01-08', '2024-01-22', NULL, 'en cours', 2),
(8, 14, '2024-01-10', '2024-01-24', NULL, 'en cours', 2),
(9, 17, '2024-01-12', '2024-01-26', NULL, 'en cours', 3),
(4, 20, '2024-01-03', '2024-01-17', NULL, 'en cours', 2),
(5, 23, '2024-01-06', '2024-01-20', NULL, 'en cours', 2),
(6, 24, '2024-01-09', '2024-01-23', NULL, 'en cours', 3),
(7, 6, '2023-12-15', '2023-12-29', '2023-12-28', 'terminé', 3),
(4, 3, '2023-12-01', '2023-12-15', '2023-12-18', 'en retard', 2),
(8, 1, '2023-11-20', '2023-12-04', '2023-12-04', 'terminé', 2),
(9, 12, '2023-12-10', '2023-12-24', '2023-12-23', 'terminé', 3),
(5, 15, '2023-12-05', '2023-12-19', '2023-12-20', 'en retard', 2),
(6, 18, '2023-12-08', '2023-12-22', '2023-12-21', 'terminé', 2),
(4, 29, '2024-01-05', '2024-01-19', NULL, 'en cours', 2),
(5, 32, '2024-01-08', '2024-01-22', NULL, 'en cours', 3),
(6, 35, '2024-01-10', '2024-01-24', NULL, 'en cours', 2),
(7, 37, '2024-01-12', '2024-01-26', NULL, 'en cours', 3),
(8, 40, '2024-01-15', '2024-01-29', NULL, 'en cours', 2),
(9, 42, '2024-01-17', '2024-01-31', NULL, 'en cours', 3),
(4, 45, '2024-01-14', '2024-01-28', NULL, 'en cours', 2),
(5, 47, '2024-01-16', '2024-01-30', NULL, 'en cours', 3),
(6, 50, '2024-01-18', '2024-02-01', NULL, 'en cours', 2),
(7, 52, '2023-12-15', '2023-12-29', '2023-12-28', 'terminé', 3),
(8, 54, '2023-12-18', '2024-01-01', '2024-01-01', 'terminé', 2),
(9, 57, '2023-12-20', '2024-01-03', '2024-01-02', 'terminé', 3),
(4, 60, '2023-12-22', '2024-01-05', '2024-01-04', 'terminé', 2),
(5, 63, '2023-12-25', '2024-01-08', '2024-01-09', 'en retard', 3),
(6, 65, '2023-12-28', '2024-01-11', '2024-01-10', 'terminé', 2),
(7, 67, '2023-12-30', '2024-01-13', '2024-01-14', 'en retard', 3),
(8, 69, '2024-01-02', '2024-01-16', NULL, 'en cours', 2),
(4, 31, '2023-12-10', '2023-12-24', '2023-12-23', 'terminé', 2), 
(5, 34, '2023-12-12', '2023-12-26', '2023-12-26', 'terminé', 3), 
(6, 36, '2023-12-14', '2023-12-28', '2023-12-27', 'terminé', 2), 
(7, 39, '2023-12-16', '2023-12-30', '2023-12-30', 'terminé', 3), 
(8, 41, '2023-12-18', '2024-01-01', '2024-01-01', 'terminé', 2), 
(9, 44, '2023-12-20', '2024-01-03', '2024-01-03', 'terminé', 3), 
(4, 46, '2023-12-22', '2024-01-05', '2024-01-05', 'terminé', 2), 
(5, 49, '2023-12-24', '2024-01-07', '2024-01-07', 'terminé', 3), 
(6, 51, '2023-12-26', '2024-01-09', '2024-01-09', 'terminé', 2), 
(7, 53, '2023-12-28', '2024-01-11', '2024-01-11', 'terminé', 3), 
(8, 56, '2023-12-30', '2024-01-13', '2024-01-13', 'terminé', 2), 
(9, 59, '2024-01-01', '2024-01-15', NULL, 'en cours', 3), 
(4, 62, '2024-01-03', '2024-01-17', NULL, 'en cours', 2), 
(5, 64, '2024-01-05', '2024-01-19', NULL, 'en cours', 3), 
(6, 66, '2024-01-07', '2024-01-21', NULL, 'en cours', 2); 

INSERT INTO reservations (user_id, book_id, reservation_status, expiration_date) VALUES
(1, 18, 'active', '2024-02-12'),  
(1, 2, 'confirmée', '2024-02-08'),
(2, 28, 'active', '2024-02-15'),
(6, 2, 'annulée', '2024-01-15'),
(7, 4, 'confirmée', '2024-02-05'),
(8, 1, 'active', '2024-02-10'),
(9, 5, 'confirmée', '2024-02-15'),
(4, 28, 'active', '2024-02-20'),
(5, 6, 'annulée', '2024-01-25'),
(3, 9, 'active', '2024-02-18'), 
(4, 11, 'active', '2024-02-19'),
(5, 13, 'confirmée', '2024-02-20'),
(6, 15, 'active', '2024-02-21'),
(7, 17, 'confirmée', '2024-02-22'),
(8, 20, 'active', '2024-02-23'),
(9, 23, 'confirmée', '2024-02-24'),
(3, 26, 'active', '2024-02-25'),
(4, 27, 'confirmée', '2024-02-26'),
(5, 10, 'active', '2024-02-27'),  
(6, 12, 'active', '2024-02-27'),  
(7, 14, 'active', '2024-02-27'),  
(8, 16, 'confirmée', '2024-02-27'),  
(9, 19, 'active', '2024-02-27'),  
(3, 21, 'confirmée', '2024-02-27'),  
(4, 22, 'active', '2024-02-27'),  
(5, 24, 'confirmée', '2024-02-27'),  
(6, 7, 'active', '2024-02-27'),  
(7, 8, 'confirmée', '2024-02-27');  

INSERT INTO notifications (user_id, notification_type, notification_message) VALUES
(1, 'rappel_emprunt', 'Votre emprunt du livre "Les Misérables" arrive à échéance dans 3 jours.'),
(1, 'nouvelle_reservation', 'Le livre "1984" que vous avez réservé est disponible.'),
(2, 'rappel_emprunt', 'Votre emprunt du livre "Le Seigneur des Anneaux" arrive à échéance dans 4 jours.'),
(2, 'date_echeance', 'Maintenance du système prévue ce soir à 22h.'),
(4, 'rappel_emprunt', 'Votre emprunt arrive à échéance dans 2 jours.'),
(5, 'nouvelle_reservation', 'Votre réservation a été confirmée.'),
(7, 'date_echeance', 'Un livre que vous avez réservé est maintenant disponible.'),
(8, 'rappel_emprunt', 'Merci de retourner votre livre dans les plus brefs délais.');

INSERT INTO logs (user_id, log_action, log_details) VALUES
(1, 'connexion', 'Connexion au système administrateur'),
(1, 'modification_paramètres', 'Mise à jour des paramètres de durée d''emprunt'),
(1, 'création_compte', 'Création du compte bibliothécaire pour Sophie Martin'),
(1, 'suspension_compte', 'Suspension du compte utilisateur Emma Moreau pour retards répétés'),
(1, 'backup_système', 'Lancement de la sauvegarde mensuelle'),
(1, 'création_compte', 'Création d''un nouveau compte bibliothécaire'),
(2, 'inventaire', 'Début de l''inventaire annuel'),
(2, 'validation_emprunt', 'Validation de l''emprunt pour Jean Dubois - Les Misérables'),
(2, 'retour_livre', 'Validation du retour - Le Petit Prince - État correct'),
(2, 'mise_à_jour_catalogue', 'Ajout de 3 nouveaux exemplaires de Harry Potter'),
(2, 'gestion_réservations', 'Traitement des réservations expirées'),
(2, 'validation_emprunt', 'Validation de l''emprunt #1'),
(3, 'ajout_livre', 'Ajout d''un nouveau livre au catalogue'),
(1, 'suspension_compte', 'Suspension du compte utilisateur #6'),
(2, 'retour_livre', 'Validation du retour de l''exemplaire #3');