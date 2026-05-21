-- Création de la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS `projet-examen`;

-- On utilise la base de données créer
USE `projet-examen`;

-- Table des Utilisateurs
-- Cette table stocke les informations des utilisateurs (membres et administrateurs)

CREATE TABLE IF NOT EXISTS `utilisateurs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY, -- Identifiant unique pour chaque utilisateur
  `email` VARCHAR(255) NOT NULL UNIQUE, -- Adresse email unique pour se connecter
  `mot_de_passe` VARCHAR(255) NOT NULL, -- Mot de passe (sera haché par la suite pour la sécurité)
  `nom` VARCHAR(100) NOT NULL, -- Nom complet de l'utilisateur
  `role` ENUM('admin', 'membre') NOT NULL DEFAULT 'membre', -- Rôle pour définir les permissions
  `date_inscription` TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Date automatique d'inscription
);


-- Table des Projets
-- Cette table contient tous les projets créés dans l'application

CREATE TABLE IF NOT EXISTS `projets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY, -- Identifiant unique du projet
  `titre` VARCHAR(255) NOT NULL, -- Titre ou nom du projet
  `description` TEXT, -- Explication détaillée du projet
  `createur_id` INT NOT NULL, -- L'identifiant de l'utilisateur qui a créé le projet
  `date_creation` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Date automatique de création
  `date_echeance` DATE, -- La date limite pour le projet complet
  `fichier_cahier_charges` VARCHAR(255), -- Chemin vers le cahier des charges uploadé
  -- On crée une relation avec la table utilisateurs
  FOREIGN KEY (`createur_id`) REFERENCES `utilisateurs`(`id`) ON DELETE CASCADE
);

-- Table des Tâches
-- Cette table liste toutes les tâches qui sont rattachées à un projet

CREATE TABLE IF NOT EXISTS `taches` (
  `id` INT AUTO_INCREMENT PRIMARY KEY, -- Identifiant unique de la tâche
  `projet_id` INT NOT NULL, -- Le projet auquel cette tâche appartient
  `titre` VARCHAR(255) NOT NULL, -- Le nom de la tâche à faire
  `description` TEXT, -- Détails sur ce qu'il faut faire
  `statut` ENUM('À faire', 'En cours', 'Terminé') NOT NULL DEFAULT 'À faire', -- L'état d'avancement
  `echeance` DATE, -- La date limite pour terminer la tâche
  `date_creation` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Date de création de la tâche
  `fichier_attache` VARCHAR(255), -- Chemin vers un fichier attaché à la tâche
  -- Relations avec les autres tables
  FOREIGN KEY (`projet_id`) REFERENCES `projets`(`id`) ON DELETE CASCADE
);

-- Table des Assignations (Tâches <-> Utilisateurs)
-- Cette table permet d'assigner une tâche à plusieurs utilisateurs (relation plusieurs-à-plusieurs)

CREATE TABLE IF NOT EXISTS `tache_assignations` (
  `tache_id` INT NOT NULL,
  `utilisateur_id` INT NOT NULL,
  PRIMARY KEY (`tache_id`, `utilisateur_id`),
  FOREIGN KEY (`tache_id`) REFERENCES `taches`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs`(`id`) ON DELETE CASCADE
);

-- Table des Commentaires
-- Permet aux utilisateurs d'échanger sur une tâche

CREATE TABLE IF NOT EXISTS `commentaires` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `tache_id` INT NOT NULL,
  `utilisateur_id` INT NOT NULL,
  `contenu` TEXT NOT NULL,
  `date_creation` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`tache_id`) REFERENCES `taches`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs`(`id`) ON DELETE CASCADE
);
