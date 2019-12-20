const router = require('express').Router();
const { Customer, validate } = require('../models/customer');

router.get('', async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

router.get('/:id', async (req, res) => {
  const customer = await getCustomers({ _id: req.params.id });

  customer
    ? res.send(customer)
    : res.status(404).send('customer does not exists');
});

router.post('', async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.send(customer);
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

  const customer = await Customer.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    { new: true }, // getting updated object from DB
  );

  if (!customer) {
    return res.status(404).send('genre does not exists');
  }

  res.send(customer);
});

router.delete('/:id', async (req, res) => {
  // CourseDeleteOne, Genre.deleteMany
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer) {
    return res.status(404).send('genre does not exists');
  }

  res.send(customer);
});

async function getCustomers(
  filterObj={
    // isGold: true,
  },
  selectProp={},
  sortBy={}, //{name: -1}  or '-name'
  pagination,
) {
  const pageNumber = pagination ? pagination.pageNumber : 1;
  const pageSize = pagination ? pagination.pageSize : 100;

  return await Customer
    .find(filterObj)
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort(sortBy)
    .select(selectProp);
    // .count();
}

module.exports = router;
