const request = require('supertest');
const mongoose = require('mongoose');

const { Genre } = require('../models/genre');
const { User } = require('../models/user');

let server;

describe('api/genres', () => {
  beforeEach(() => { server = require('../index'); });
  afterEach(async () => {
    await Genre.remove({});
    server.close();
  });

  describe('GET /', () => {
    it('should return all genres', async () => {
      await Genre.collection.insertMany([
        { name: 'genre1'},
        { name: 'genre2'},
      ]);

      const res = await request(server).get('/api/genres');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
      expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('should return a genre if valid id is passed', async () => {
      const genre = new Genre({ name: 'action'});

      await genre.save();
      const res = await request(server).get(`/api/genres/${genre._id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', genre.name);
    });

    it('should return 404 if invalid id', async () => {
      const res = await request(server).get(`/api/genres/1`);

      expect(res.status).toBe(404);
    });

    it('should return 404 if no genre with a given id exists', async () => {
      const id = new mongoose.Types.ObjectId().toHexString();
      const res = await request(server).get(`/api/genres/${id}`);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {
    it('should return 401 if client is not logged in', async () => {
      const token = '';
      const res = await saveGenre(token, { name: 'genre1' });
      // console.log(res.text);

      expect(res.status).toBe(401);
    });

    it('should return 400 if genre is invalid', async () => {
      const token = getToken();
      const res = await saveGenre(token, { name: 'genre1' });

      expect(res.status).toBe(400);
    });

    it('should save the genre if it is valid', async () => {
      const token = getToken();
      await saveGenre(token, { name: 'action' });
      const genre = await Genre.find({ name: 'action' });

      expect(genre).not.toBeNull();
    });

    it('should return the genre if it is valid', async () => {
      const token = getToken();
      const res = await saveGenre(token, { name: 'action' });

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'action');
    });
  });

  describe('PUT /:id', () => {
    it('should return 404 if invalid id', async () => {
      const token = getToken();
      const id = 1;
      const reqBody = { name: 'action' };
      const res = await updateGenre(token, id, reqBody);

      expect(res.status).toBe(404);
    });

    it('should return 400 if genre is invalid', async () => {
      const token = getToken();
      const reqBody = { name: 'genre1' };
      const id = new mongoose.Types.ObjectId().toHexString();
      const res = await updateGenre(token, id, reqBody);

      expect(res.status).toBe(400);
    });

    it('should update the genre if it is valid', async () => {
      const token = getToken();
      let res = await saveGenre(token, { name: 'action' });
      res = await updateGenre(token, res.body._id, { name: 'comedy' });

      expect(res.body).toHaveProperty('name', 'comedy');
    });
  });

  describe('DELETE /:id', () => {
    it('should return 401 if client is not logged in', async () => {
      const token = '';
      const res = await deleteGenre(token, 1);

      expect(res.status).toBe(401);
    });

    it('should return 403 if client is not admin', async () => {
      const user = {
        _id: new mongoose.Types.ObjectId().toHexString(),
        isAdmin: false
      };
      const token = getToken(user);
      const res = await deleteGenre(token, 1);

      expect(res.status).toBe(403);
    });

    it('should return 404 if invalid id', async () => {
      const user = {
        _id: new mongoose.Types.ObjectId().toHexString(),
        isAdmin: true
      };
      const token = getToken(user);
      const res = await deleteGenre(token, 1);

      expect(res.status).toBe(404);
    });

    it('should return 404 if genre does not exist', async () => {
      const user = {
        _id: new mongoose.Types.ObjectId().toHexString(),
        isAdmin: true
      };
      const token = getToken(user);
      const id = new mongoose.Types.ObjectId().toHexString();
      const res = await deleteGenre(token, id);

      expect(res.status).toBe(404);
    });

    it('should genre the genre if it exists', async () => {
      const user = {
        _id: new mongoose.Types.ObjectId().toHexString(),
        isAdmin: true
      };
      const token = getToken(user);
      let res = await saveGenre(token, { name: 'action' });
      res = await deleteGenre(token, res.body._id);

      expect(res.status).toBe(200);
    });
  });
});

function getToken(user={}) {
  return new User(user).generateAuthToken();
}

function deleteGenre(token, id) {
  return request(server)
    .delete(`/api/genres/${id}`)
    .set('x-auth-token', token)
    .send();
}

function saveGenre(token, reqBody) {
  return request(server)
    .post(`/api/genres`)
    .set('x-auth-token', token)
    .send(reqBody);
}

function updateGenre(token, id, reqBody) {
  return request(server)
    .put(`/api/genres/${id}`)
    .set('x-auth-token', token)
    .send(reqBody);
}