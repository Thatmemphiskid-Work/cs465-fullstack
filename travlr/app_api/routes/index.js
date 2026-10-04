const express = require('express');
const router = express.Router();

const tripsController = require('../controllers/trips');

// GET /api/trips
router
  .route('/trips')
  .get(tripsController.tripsList);

// GET /api/trips/:tripCode
router
  .route('/trips/:tripCode')
  .get(tripsController.tripsFindByCode);

module.exports = router;