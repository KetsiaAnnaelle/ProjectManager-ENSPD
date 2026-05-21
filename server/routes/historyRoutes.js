const express = require('express');
const router = express.Router();
const controllerHistorique = require('../controllers/historyController');
const { protegerRoute } = require('../middleware/authMiddleware');

router.get('/', protegerRoute, controllerHistorique.historiqueRecent);

module.exports = router;
