const router = require('express').Router();
const { Genre, validate } = require('../models/genre');

router.get('', async (req, res) => {
  const genres = await getGenres({});
  res.send(genres);
});

router.get('/:id', async (req, res) => {
  const genre = await getGenres({ _id: req.params.id });

  genre
    ? res.send(genre)
    : res.status(404).send('genre does not exists');
});

router.post('', async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const genre = new Genre(req.body);
    await genre.save();
    res.send(genre);
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

router.delete('/:id', async (req, res) => {
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
  sortBy={}, //{price: -1}  or '-price'
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
