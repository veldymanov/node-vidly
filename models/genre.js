const mongoose = require('mongoose');
const Joi = require('joi');

const Genre = mongoose.model('Genre', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
    // match: /pattern/,
  },
  category: {
    type: String,
    required: true,
    enum: ['novel', 'verse', 'poem'],
    lowercase: true,
  },
  author: String,
  tags: {
    type: Array,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'A course should have at least one tag',
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isPublished: Boolean,
  price: {
    type: Number,
    required: function() { return this.isPublished; },
    get: v => Math.round(v),
    set: v => Math.round(v),
  },
}));

function validateGenres(genre) {
  const schema = {
    name: Joi.string().min(5).max(255).required(),
    category: Joi.string(), //.valid(['novel', 'verse', 'poem']).required(),
    author: Joi.string(),
    tags: Joi.array().items(Joi.string()),
    date: Joi.date(),
    isPublished: Joi.boolean(),
    price: Joi.number()
  };

  return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.validate = validateGenres;