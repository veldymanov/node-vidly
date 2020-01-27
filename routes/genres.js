const router = require('express').Router();

const admin = require('../middlewares/admin');
const auth = require('../middlewares/auth');
const validateObjectId = require('../middlewares/validateObjectId');
const { Genre, validate } = require('../models/genre');

router.get('/', async (req, res, next) => {
  // throw new Error('Logger try');

  const genres = await getGenres({});
  res.send(genres);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  console.log('genre ', genre);

  genre
    ? res.send(genre)
    : res.status(404).send('genre does not exists');
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre(req.body);
  genre = await genre.save();

  res.send(genre);
});

router.put('/:id', validateObjectId, async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const genre = await Genre.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    { new: true }, // getting updated object from DB
  );

  if (!genre) {
    return res.status(404).send('genre does not exists');
  }

  res.send(genre);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
  // CourseDeleteOne, Genre.deleteMany
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) {
    return res.status(404).send('genre does not exists');
  }

  res.send(genre);
});

async function getGenres(
  filterObj={
    author: /.*Andrii.*/i, // /^Andrii/i, /Veldymanov$/i
    isPublished: true,
    tags: 'new',
    category: 'novel',
    // price: {$gte: 10, $lte: 20},
    // price: {$in: [10, 15, 20]},
  },
  selectProp={}, // {name: 1, author: 1, price: 1} or 'name author price'
  sortBy={name: 1}, // {price: -1}  or '-price'
  pagination,
) {
  const pageNumber = pagination ? pagination.pageNumber : 1;
  const pageSize = pagination ? pagination.pageSize : 100;

  return await Genre
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
