const config = require('config');
const mongoose = require('mongoose');
const { logger } = require('./logging');

module.exports = function() {
  const db = config.get('db');

  mongoose.connect(db, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => logger.info(`Connected to ${db}...`));
}
