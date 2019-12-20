const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genre');

const Movie = mongoose.model('Movie', new mongoose.Schema({
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  genre: { // Embedded Document
    type: genreSchema,
    required: true,
  },
  isAvailable: { // for studying
    type: Boolean,
    default: true,
  },
  numberInStock: {
    type: Number,
    required: function() { return this.isAvailable; },
    min: 0,
    max: 255,
    // get: v => Math.round(v),
    // set: v => Math.round(v),
  },
  tags: {
    type: Array,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'A movie should have at least one tag',
    },
  },
  title: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
    trim: true,
  },
}));

function validateMovies(movie) {
  const schema = {
    dailyRentalRate: Joi.number().min(0).max(255).required(),
    date: Joi.date(),
    genreId: Joi.objectId().required(),
    isAvailable: Joi.boolean(),
    numberInStock: Joi.number().min(0).max(255),
    tags: Joi.array().items(Joi.string()),
    title: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.validate = validateMovies;