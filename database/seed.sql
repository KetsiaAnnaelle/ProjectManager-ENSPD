-- On s'assure d'utiliser la bonne base de données
USE `projet-examen`;

-- -----------------------------------------------------
-- Ajout d'utilisateurs de test
-- -----------------------------------------------------
-- Le mot de passe ici est "password123" haché avec bcrypt pour les deux utilisateurs
INSERT INTO `utilisateurs` (`email`, `mot_de_passe`, `nom`, `role`) VALUES
('admin@test.com', '$2b$10$yO0Qk3a5UqyGvjA9h8y6H.q7O.G2S8Mv5w2c6u3Z6xP1X7e7P1mS2', 'Administrateur Principal', 'admin'),
('membre@test.com', '$2b$10$yO0Qk3a5UqyGvjA9h8y6H.q7O.G2S8Mv5w2c6u3Z6xP1X7e7P1mS2', 'Membre Equipe', 'membre');

-- -----------------------------------------------------
-- Ajout de projets de test
-- -----------------------------------------------------
-- On attribue ces projets à l'utilisateur admin (id = 1)
INSERT INTO `projets` (`titre`, `description`, `createur_id`) VALUES
('Refonte du site web', 'Refonte complète du site web de l\'entreprise avec de nouvelles couleurs (Bleu, blanc, rouge).', 1),
('Application Mobile', 'Développement de la nouvelle application mobile en React Native.', 1);

-- -----------------------------------------------------
-- Ajout de tâches de test
-- -----------------------------------------------------
-- On attribue des tâches aux projets créés
INSERT INTO `taches` (`projet_id`, `titre`, `description`, `assigne_a`, `statut`, `echeance`) VALUES
(1, 'Maquette Figma', 'Créer les maquettes des pages d\'accueil et de contact.', 2, 'À faire', '2026-05-01'),
(1, 'Configuration du serveur', 'Mettre en place le serveur Node.js et Express.', 1, 'En cours', '2026-04-20'),
(2, 'Conception de la base de données', 'Faire un schéma de la base de données pour l\'application.', 1, 'Terminé', '2026-04-10');
