const express = require('express');
const router = express.Router();
const ControllerCommentaire = require('../controllers/commentController');
const { protegerRoute } = require('../middleware/authMiddleware');

// Toujours protéger ces routes pour être sûr que l'utilisateur est connu
router.use(protegerRoute);

// Obtenir tous les commentaires pour une tâche X
router.get('/tache/:idTache', ControllerCommentaire.commentairesDuneTache);

// Ajouter un commentaire sur une tâche X
router.post('/tache/:idTache', ControllerCommentaire.nouveauCommentaire);

module.exports = router;
