const config = require('config');
const Fawn = require('fawn');
const mongoose = require('mongoose');

const { logger } = require('./logging');

module.exports = function() {
  const db = config.get('db');

  Fawn.init(mongoose);

  mongoose.connect(db, {
    useUnifiedTopology: true,
    // useFindAndModify: false,
    useNewUrlParser: true,
  })
    .then(() => logger.info(`Connected to ${db}...`));
}
