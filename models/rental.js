const mongoose = require('mongoose');
const Joi = require('joi');

const Rental = mongoose.model('Rental', new mongoose.Schema({
  customer: {
    // the customer can have a lot properties
    // but we need just several
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50,
      },
      phone: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50,
      },
      isGold: {
        type: Boolean,
        default: false,
      }
    }),
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
      },
      title: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 255,
        trim: true,
      },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    default: Date.now,
    requred: true,
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
}));

function validateRentals(rental) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  };

  return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validator = validateRentals;