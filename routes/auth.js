const router = require('express').Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const _ = require('lodash');

const { User } = require('../models/user');
const validate = require('../middlewares/validate');

router.post('/', validate(validator), async (req, res) => {
  const user = await User.findOne({email: req.body.email});
  if (!user) return res.status(400).send('Invalid email or password');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password');

  const token = user.generateAuthToken();

  res.send(token);
});

function validator(user) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  };

  return Joi.validate(user, schema);
}

module.exports = router;
