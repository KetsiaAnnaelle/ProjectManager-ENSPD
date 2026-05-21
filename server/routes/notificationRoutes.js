const express = require('express');
const router = express.Router();
const controllerNotif = require('../controllers/notificationController');
const { protegerRoute } = require('../middleware/authMiddleware');

router.get('/', protegerRoute, controllerNotif.pourUtilisateur);
router.patch('/:id/lire', protegerRoute, controllerNotif.marquerCommeLue);
router.patch('/lire-tout', protegerRoute, controllerNotif.marquerToutCommeLu);

module.exports = router;
