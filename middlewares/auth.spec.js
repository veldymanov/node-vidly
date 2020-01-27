const { User } = require('../models/user');
const auth = require('./auth');
const mongoose = require('mongoose');

describe('auth middleware', () => {
  it('should populate req.user with the payload of a valid JWT', () => {
    const user = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true
    };
    const token = getToken(user);
    const req = {
      header: jest.fn().mockReturnValue(token)
    };
    const res = {};
    const next = jest.fn();

    auth(req, res, next);

    expect(req.user).toMatchObject(user);
  });
});

function getToken(user={}) {
  return new User(user).generateAuthToken();
}