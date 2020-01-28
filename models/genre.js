const mongoose = require('mongoose');
const Joi = require('joi');

const genreCategories = [
  'action',
  'comedy',
  'fantasy',
  'horror',
  'melodrama'
];

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: genreCategories,
    lowercase: true,
    // match: /pattern/,
  },
})

const Genre = mongoose.model('Genre', genreSchema);

function validateGenres(genre) {
  const schema = {
    name: Joi.string().valid(genreCategories).required(),
  };

  return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.genreSchema = genreSchema;
exports.validator = validateGenres;