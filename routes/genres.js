const express = require('express');
const Joi = require('joi');

const router = express.Router();

const genres = [
  { id: 1, genre: 'genre1' },
  { id: 2, genre: 'genre2' },
  { id: 3, genre: 'genre3' },
  { id: 4, genre: 'genre4' },
];

router.get('', (req, res) => {
  res.send(genres);
});

router.get('/:id', (req, res) => {
  const genre = genres.find(genre => genre.id === +req.params.id);

  genre
    ? res.send(genre)
    : res.status(404).send('genre does not exists');
});

router.post('', (req, res) => {
  const { error } = validateGenres(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const genre = {
    id: genres.length + 1,
    name: req.body.name,
  };

  genres.push(genre);
  res.send(genre);
});

router.put('/:id', (req, res) => {
  const genre = genres.find(genre => genre.id === +req.params.id);

  if (!genre) {
    res.status(404).send('genre does not exists');
    return;
  }

  const { error } = validateGenres(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  genre.name = req.body.name;
  res.send(genre);
});

router.delete('/:id', (req, res) => {
  const genre = genres.find(genre => genre.id === +req.params.id);

  if (!genre) {
    res.status(404).send('genre does not exists');
    return;
  }

  const index = genres.indexOf(genre);
  genres.splice(index, 1);

  res.send(genre);
});

function validateGenres(genre) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(genre, schema);
}

module.exports = router;