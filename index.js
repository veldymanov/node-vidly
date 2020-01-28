

const debug = require('debug')('app:startup');
const express = require('express');
const morgan = require('morgan');

const db = require('./startup/db');
const { logger } = require('./startup/logging');

const app = express();

db();
require('./startup/routes')(app);
require('./startup/config')();
require('./startup/validation')();

if (app.get('env') === 'production') {
  console.log('production');
  require('./startup/prod')(app);
}

if (app.get('env') === 'development') { // env = process.env.NODE_ENV || 'development';
  app.use(morgan('tiny')); // logging http requests to terminal
  debug('morgan is enabled');
}

app.set('view engine', 'pug');
app.set('views', './views'); // default

// export PORT=5000
const port = process.env.PORT || 3000;
const server = app.listen(port, () => logger.info(`Listenning on port ${port}...`));

module.exports = server;
