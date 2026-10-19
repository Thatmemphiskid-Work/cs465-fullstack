const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');

// Middleware to authenticate JWT bearer tokens
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log('Authorization header required but not present.');

    return res
      .status(401)
      .json({ message: 'Authorization required' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res
      .status(401)
      .json({ message: 'Invalid authorization header' });
  }

  const token = parts[1];

  try {
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.auth = verified;
    next();

  } catch (error) {
    console.error('Token validation error:', error.message);

    return res
      .status(401)
      .json({ message: 'Token validation failed' });
  }
}

// Authentication routes
router
  .route('/register')
  .post(authController.register);

router
  .route('/login')
  .post(authController.login);

// Trip collection
router
  .route('/trips')
  .get(tripsController.tripsList)
  .post(authenticateJWT, tripsController.tripsAddTrip);

// Individual trip
router
  .route('/trips/:tripCode')
  .get(tripsController.tripsFindByCode)
  .put(authenticateJWT, tripsController.tripsUpdateTrip);

module.exports = router;
