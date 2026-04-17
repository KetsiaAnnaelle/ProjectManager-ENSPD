const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const ControllerProjet = require('../controllers/projectController');
const { verifierValidation } = require('../middleware/validateMiddleware');
const { protegerRoute } = require('../middleware/authMiddleware');

// Toutes les requêtes concernant un projet doivent être faites par une personne connectée !
// On applique "protegerRoute" de manière globale à ce fichier.
router.use(protegerRoute); 

// (GET /api/projets) -> Liste de tous les projets
router.get('/', ControllerProjet.listerProjets);

// (GET /api/projets/:id) -> Infos d'un seul projet spécifique
router.get('/:id', ControllerProjet.detailProjet);

// (POST /api/projets) -> Créer un tout nouveau projet
router.post('/', [
    body('titre').notEmpty().withMessage("Le titre du projet est obligatoire."),
    body('description').optional().isString(), // La description est facultative
    verifierValidation
], ControllerProjet.nouveauProjet);

// (PUT /api/projets/:id) -> Modifier un projet
router.put('/:id', [
    body('titre').notEmpty().withMessage("Le titre est requis pour la modification."),
    verifierValidation
], ControllerProjet.modifierProjet);

// (DELETE /api/projets/:id) -> Supprimer un projet
router.delete('/:id', ControllerProjet.supprimerProjet);

module.exports = router;
