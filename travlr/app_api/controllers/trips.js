const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register model
const Model = mongoose.model('trips');

// GET: /trips - lists all the trips
const tripsList = async (req, res) => {
  const q = await Model
    .find({})
    .exec();

  if (!q) {
    return res
      .status(404)
      .json({ message: 'No trips found' });
  } else {
    return res
      .status(200)
      .json(q);
  }
};

// GET: /trips/:tripCode - returns a single trip
const tripsFindByCode = async (req, res) => {
  const q = await Model
    .find({ code: req.params.tripCode })
    .exec();

  if (!q || q.length === 0) {
    return res
      .status(404)
      .json({ message: 'Trip not found' });
  } else {
    return res
      .status(200)
      .json(q);
  }
};

module.exports = {
  tripsList,
  tripsFindByCode
};