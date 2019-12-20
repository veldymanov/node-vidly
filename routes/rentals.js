const router = require('express').Router();
const Fawn = require('fawn');
const mongoose = require('mongoose');

const { Rental, validate } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');

Fawn.init(mongoose);

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) res.status(400).send('Invalid customer.');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) res.status(400).send('Invalid movie.');

  if (movie.numberInStock === 0) {
    return res.status(400).send('Movie not in stock');
  }

  try {
    const rental = new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        isGold: customer.isGold,
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
    });

    // rental = await rental.save();
    // movie.numberInStock--;
    // await movie.save();
    try {
      new Fawn.Task()
        .save('rentals', rental) // 'rentals' plural and case sensitive, see in Compass
        .update('movies', { _id: movie._id }, {
          $inc: { numberInStock: -1 }
        })
        .run();

      res.send(rental);
    } catch (ex) {
      res.status(500).send('Transaction failed');
    }
  }
  catch (ex) {
    const errArr = [];

    for (field in ex.errors) {
      errArr.push(ex.errors[field].message);
    };

    res.status(400).send(errArr);
  }
});

module.exports = router;
