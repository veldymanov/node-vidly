
const config = require('config');
const debug = require('debug')('app:startup');
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const morgan = require('morgan');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const auth = require('./routes/auth');
const customers = require('./routes/customers');
const genres = require('./routes/genres');
const home = require('./routes/home');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');

const logger = require('./middlewares/logger');

const app = express();

if (!config.get('jwtSecret')) {
  console.error('FATAL ERROR: jwtSecret is not defined');
  process.exit(1);
}

mongoose.connect('mongodb://localhost:27017/vidly', {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB vidly...'))
  .catch((err) => console.log('Could not connect to MongoDB...', err));

app.set('view engine', 'pug');
app.set('views', './views'); // default

app.use(express.json());
app.use(express.urlencoded({extended: true})); // form request: key1=value1&key2=value2
app.use(express.static('public'));
app.use(helmet());

if (app.get('env') === 'development') {
  app.use(morgan('tiny')); // logging http requests to terminal
  debug('morgan is enabled');
}

app.use('', home);
app.use('/api/auth', auth);
app.use('/api/customers', customers);
app.use('/api/genres', genres);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);


// export PORT=5000
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listenning on port ${port}...`));
