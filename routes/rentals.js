const router = require('express').Router();
const Fawn = require('fawn');

const admin = require('../middlewares/admin');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const { Rental, validator } = require('../models/rental');


router.get('/', [auth, admin],  async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.post('/', [auth, admin, validate(validator)], async (req, res) => {
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) res.status(400).send('Invalid customer.');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) res.status(400).send('Invalid movie.');

  if (movie.numberInStock === 0) {
    return res.status(400).send('Movie not in stock');
  }

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
    await Fawn.Task()
      .save('rentals', rental) // 'rentals' plural and case sensitive, see in Compass
      .update('movies', { _id: movie._id }, {
        $inc: { numberInStock: -1 }
      })
      .run();

    res.send(rental);
  } catch (ex) {
    res.status(500).send('Transaction failed');
  }
});

module.exports = router;
