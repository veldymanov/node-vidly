const request = require('supertest');

const { User } = require('../models/user');
const { Genre } = require('../models/genre');

let server;

describe('auth middleware', () => {
  beforeEach(() => { server = require('../index'); });
  afterEach(async () => {
    await Genre.remove({});
    await server.close();
  });

  it('should return 401 if JWT not provided', async () => {
    const token = '';
    const res = await saveGenre(token);

    expect(res.status).toBe(401);
  });

  it('should return 400 if JWT is invalid', async () => {
    const token = '1234';
    const res = await saveGenre(token);

    expect(res.status).toBe(400);
  });

  it('should return a JWT payload if token is valid', async () => {
    const token = getToken();
    const res = await saveGenre(token);

    expect(res.status).toBe(200);
  });
});

function getToken() {
  return new User().generateAuthToken();
}

function saveGenre(token, postBody = {name: 'action'}) {
  return request(server)
    .post(`/api/genres`)
    .set('x-auth-token', token)
    .send(postBody);
}