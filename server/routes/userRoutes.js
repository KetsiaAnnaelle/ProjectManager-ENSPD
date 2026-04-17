const express = require('express');
const routeur = express.Router();
const userController = require('../controllers/userController');
const { protegerRoute } = require('../middleware/authMiddleware');

// Route pour les statistiques du tableau de bord
routeur.get('/stats', protegerRoute, userController.recupererStats);

// Route pour récupérer tous les utilisateurs (sécurisée)
routeur.get('/', protegerRoute, userController.recupererTous);

module.exports = routeur;
