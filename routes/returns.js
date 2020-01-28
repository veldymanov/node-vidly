const router = require('express').Router();
const Fawn = require('fawn');
const moment = require('moment');

const admin = require('../middlewares/admin');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { Rental, validator } = require('../models/rental');


router.post('/', [ auth, admin, validate(validator)], async (req, res) => {
  const rental = await Rental.findOne({
    'customer._id': req.body.customerId,
    'movie._id': req.body.movieId
  });

  if (!rental) return res.status(404).send('rental does not exists');

  if (rental.dateReturned) return res.status(400).send('rental has already been processed');

  rental.dateReturned = new Date();
  rental.rentalFee = moment().diff(rental.dateOut, 'days') * rental.movie.dailyRentalRate;

  try {
    await Fawn.Task()
      .update('rentals', { _id: rental._id }, {
        $set: rental
      })
      .update('movies', { _id: rental.movie._id }, {
        $inc: { numberInStock: 1 }
      })
      .run();

    res.send(rental);
  } catch (ex) {
    res.status(500).send('Transaction failed');
  }
});
module.exports = router;