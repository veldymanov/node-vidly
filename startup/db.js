const mongoose = require('mongoose');
const { logger } = require('./logging');

module.exports = function() {
  mongoose.connect('mongodb://localhost:27017/vidly', {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => logger.info('connected to MongoDB...'));
}
