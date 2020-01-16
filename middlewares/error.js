const { logger } = require('../startup/logging');

module.exports = function(err, req, res, next) {
  // error, warn, info, verbose, debug, silly
  logger.error(err.message, err);
  res.status(500).send('Something failed');
}
