const express = require('express');
// if error in express calls: next(err)
require('express-async-errors');

const auth = require('../routes/auth');
const customers = require('../routes/customers');
const genres = require('../routes/genres');
const home = require('../routes/home');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const returns = require('../routes/returns');
const users = require('../routes/users');
const error = require('../middlewares/error');

module.exports = function(app) {
  app.use(express.json());
  app.use(express.static('public'));

  app.use('', home);
  app.use('/api/auth', auth);
  app.use('/api/customers', customers);
  app.use('/api/genres', genres);
  app.use('/api/movies', movies);
  app.use('/api/rentals', rentals);
  app.use('/api/returns', returns);
  app.use('/api/users', users);

  // Error handling
  // Next middleware after any route handler
  // Called by express-async-errors module
  // Or can be called manually with asyncMiddleware()
  app.use(error);
}
