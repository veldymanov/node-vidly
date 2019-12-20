const express = require('express');
const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');

const router = express.Router();

router.get('', async (req, res) => {
  const movies = await getMovies({}, {}, {title: -1});
  res.send(movies);
});

router.get('/:id', async (req, res) => {
  const movie = await getMovies({ _id: req.params.id });

  movie
    ? res.send(movie)
    : res.status(404).send('movie does not exists');
});

router.post('', async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) res.status(400).send('Invalid genre.');

  try {
    const movie = new Movie({
      dailyRentalRate: req.body.dailyRentalRate,
      date: req.body.date,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      isAvailable: req.body.isAvailable,
      numberInStock: req.body.numberInStock,
      tags: req.body.tags,
      title: req.body.title,
    });

    await movie.save();
    res.send(movie);
  }
  catch (ex) {
    const errArr = [];

    for (field in ex.errors) {
      errArr.push(ex.errors[field].message);
    };

    res.status(400).send(errArr);
  }
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const movie = await Movie.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    { new: true }, // getting updated object from DB
  );

  if (!movie) {
    return res.status(404).send('movie does not exists');
  }

  res.send(movie);
});

router.delete('/:id', async (req, res) => {
  // CourseDeleteOne, Movie.deleteMany
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie) {
    return res.status(404).send('movie does not exists');
  }

  res.send(movie);
});

async function getMovies(
  filterObj={
    // numberInStock: {$gte: 10, $lte: 20},
    // dailyRentalRate: {$in: [10, 15, 20]},
  },
  selectProp={}, // {name: 1, author: 1, price: 1} or 'name author price'
  sortBy={}, //{price: -1}  or '-price'
  pagination,
) {
  const pageNumber = pagination ? pagination.pageNumber : 1;
  const pageSize = pagination ? pagination.pageSize : 100;

  return await Movie
    .find(filterObj)
    // .or([
    //   {price: {$gte: 15}},
    //   {name: /.*by*./i}
    // ])
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort(sortBy)
    .select(selectProp);
    // .count();
}

module.exports = router;
