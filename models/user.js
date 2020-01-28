const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const PasswordComplexity = require('joi-password-complexity');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
    unique: true,
  },
  password: {
    type: String,
    minLength: 5,
    maxLength: 1024,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  }
});

userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin,
    },
    config.get('jwtSecret'),
  );
}

const User = mongoose.model('User', userSchema);

const complexityOptions = {
  min: 5,
  max: 1024,
  lowerCase: 2,
  upperCase: 1,
  numeric: 2,
  symbol: 1,
  requirementCount: 4
  /*
   Min & Max not considered in the count.
   Only lower, upper, numeric and symbol.
   requirementCount could be from 1 to 4
   If requirementCount=0, then it takes count as 4
 */
};

function validateUser(user) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: new PasswordComplexity(complexityOptions),
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validator = validateUser;