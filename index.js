
const config = require('config');
const debug = require('debug')('app:startup');
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const morgan = require('morgan');

const genres = require('./routes/genres');
const home = require('./routes/home');

const logger = require('./middlewares/logger');


const app = express();

//-----------------------------------------------------------------------------------------------------------------
mongoose.connect('mongodb://localhost:27017/playground', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => debug('Connected to MongoDB...'))
  .catch((err) => console.log('Could not connect to MongoDB', err));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: {
    type: Date,
    default: Date.now,
  },
  isPublished: Boolean,
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
  const course = new Course({
    name: 'Angular course',
    author: 'Andrii',
    tags: ['angular', 'frontend'],
    isPublished: true,
  });

  const result = await course.save();
  console.log(result);
}

createCourse();

//-----------------------------------------------------------------------------------------------------------------

app.set('view engine', 'pug');
app.set('views', './views'); // default

app.use(express.json());
app.use(express.urlencoded({extended: true})); // form request: key1=value1&key2=value2
app.use(express.static('public'));
app.use(helmet());

app.use('', home);
app.use('/api/genres', genres);

if (app.get('env') === 'development') {
  app.use(morgan('tiny')); // logging http requests to terminal
  debug('morgan is enabled');
}

// export PORT=5000
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listenning on port ${port}...`));
