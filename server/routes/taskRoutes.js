const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const ControllerTache = require('../controllers/taskController');
const { verifierValidation } = require('../middleware/validateMiddleware');
const { protegerRoute } = require('../middleware/authMiddleware');

// Sécurité générale pour s'assurer que c'est un membre connecté
router.use(protegerRoute);

// (GET /api/taches/projet/:idProjet) -> Lire toutes les tâches d'un projet
router.get('/projet/:idProjet', ControllerTache.tachesDuProjet);

// (POST /api/taches/projet/:idProjet) -> Ajouter une tâche à ce projet
router.post('/projet/:idProjet', [
    body('titre').notEmpty().withMessage("Le titre de la tâche est obligatoire."),
    body('statut').optional().isIn(['À faire', 'En cours', 'Terminé']).withMessage("Statut invalide."),
    verifierValidation
], ControllerTache.nouvelleTache);

// (PATCH /api/taches/:idTache/statut) -> Mettre à jour seulement l'état d'une tâche
router.patch('/:idTache/statut', [
    body('statut').isIn(['À faire', 'En cours', 'Terminé']).withMessage("Le statut est très précis et contrôlé."),
    verifierValidation
], ControllerTache.miseAJourStatut);

// (GET /api/taches/liste/toutes) -> Obtenir de manière globale
router.get('/liste/toutes', ControllerTache.toutesLesTaches);

module.exports = router;
