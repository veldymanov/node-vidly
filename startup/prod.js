const express = require('express');
// protects the app from well known web volnarabilities
const helmet = require('helmet');
// compres https responses we send to the client
const compression = require('compression');

module.exports = function(app) {
  app.use(helmet());
  app.use(compression());
}