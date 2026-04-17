const express = require('express');
const router = express.Router(); // L'objet routeur d'express
const { body } = require('express-validator'); // Pour valider les champs
const ControllerAuthentification = require('../controllers/authController');
const { verifierValidation } = require('../middleware/validateMiddleware');
const { protegerRoute } = require('../middleware/authMiddleware');

// Route (POST /api/auth/inscription) -> Pour s'inscrire
router.post('/inscription', [
    // Définition des règles pour les champs envoyés par l'utilisateur
    body('email').isEmail().withMessage('Veuillez fournir un email valide.'),
    body('motDePasse').isLength({ min: 6 }).withMessage('Le mot de passe doit faire au moins 6 caractères.'),
    body('nom').notEmpty().withMessage('Le nom ne peut pas être vide.'),
    verifierValidation // Middleware qui arrête le traitement en cas d'erreurs
], ControllerAuthentification.inscription);

// Route (POST /api/auth/connexion) -> Pour se connecter
router.post('/connexion', [
    body('email').isEmail().withMessage('Veuillez fournir un email valide.'),
    body('motDePasse').notEmpty().withMessage('Le mot de passe est obligatoire.'),
    verifierValidation
], ControllerAuthentification.connexion);

// Route (GET /api/auth/profil) -> Pour lire les infos du profil (Besoin d'être connecté)
router.get('/profil', protegerRoute, ControllerAuthentification.profil);

module.exports = router;
