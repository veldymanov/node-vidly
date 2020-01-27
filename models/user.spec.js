const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const { User } = require('./user');

describe('user.generateAuthToken', () => {
  it('should create a valid JWT', () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true
    };
    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    expect(decoded).toMatchObject(payload);
  })
});
