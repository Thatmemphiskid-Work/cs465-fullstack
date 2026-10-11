const Trip = require('../models/travlr');

// GET: /api/trips
const tripsList = async (req, res) => {
  try {
    const trips = await Trip.find({}).exec();

    return res
      .status(200)
      .json(trips);

  } catch (error) {
    console.error('Error retrieving trips:', error);

    return res
      .status(500)
      .json({ message: 'Unable to retrieve trips' });
  }
};

// GET: /api/trips/:tripCode
const tripsFindByCode = async (req, res) => {
  try {
    const trip = await Trip
      .findOne({ code: req.params.tripCode })
      .exec();

    if (!trip) {
      return res
        .status(404)
        .json({ message: 'Trip not found' });
    }

    return res
      .status(200)
      .json(trip);

  } catch (error) {
    console.error('Error retrieving trip:', error);

    return res
      .status(500)
      .json({ message: 'Unable to retrieve trip' });
  }
};

// POST: /api/trips
const tripsAddTrip = async (req, res) => {
  try {
    const newTrip = new Trip({
      code: req.body.code,
      name: req.body.name,
      length: req.body.length,
      start: req.body.start,
      resort: req.body.resort,
      perPerson: req.body.perPerson,
      image: req.body.image,
      description: req.body.description
    });

    const savedTrip = await newTrip.save();

    return res
      .status(201)
      .json(savedTrip);

  } catch (error) {
    console.error('Error adding trip:', error);

    return res
      .status(400)
      .json({
        message: 'Unable to add trip',
        error: error.message
      });
  }
};

// PUT: /api/trips/:tripCode
const tripsUpdateTrip = async (req, res) => {
  try {
    const updatedTrip = await Trip
      .findOneAndUpdate(
        { code: req.params.tripCode },
        {
          code: req.body.code,
          name: req.body.name,
          length: req.body.length,
          start: req.body.start,
          resort: req.body.resort,
          perPerson: req.body.perPerson,
          image: req.body.image,
          description: req.body.description
        },
        {
          new: true,
          runValidators: true
        }
      )
      .exec();

    if (!updatedTrip) {
      return res
        .status(404)
        .json({ message: 'Trip not found' });
    }

    return res
      .status(201)
      .json(updatedTrip);

  } catch (error) {
    console.error('Error updating trip:', error);

    return res
      .status(400)
      .json({
        message: 'Unable to update trip',
        error: error.message
      });
  }
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip
};
