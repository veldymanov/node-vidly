const request = require('supertest');
const moment = require('moment');
const mongoose = require('mongoose');

const { Movie } = require('../models/movie');
const { Rental } = require('../models/rental');
const { User } = require('../models/user');

let server;
let customerId;
let movie;
let movieId;
let rental;
let user;

describe('api/returns', () => {
  beforeEach(async () => {
    server = require('../index');

    customerId = new mongoose.Types.ObjectId().toHexString();
    movieId = new mongoose.Types.ObjectId().toHexString();

    user = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true
    };

    movie = new Movie({
      _id: movieId,
      title: '12345',
      dailyRentalRate: 2,
      genre: { name: 'action' },
      numberInStock: 10,
      tags: ['cool']
    });
    await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: '12345',
        phone: '12345'
      },
      movie: {
        _id: movieId,
        title: '12345',
        dailyRentalRate: 2
      }
    });
    await rental.save();
  });

  afterEach(async () => {
    await Rental.remove({});
    await Movie.remove({});
    await server.close();
  });

  describe('POST /', () => {
    it('should return 401 if client is not logged in', async () => {
      const token = '';
      const res = await retunrRental(token, { customerId, movieId });
      // console.log(res.text);

      expect(res.status).toBe(401);
    });

    it('should return 403 if user is not admin', async () => {
      user.isAdmin = false;
      const token = getToken(user);
      const res = await retunrRental(token, { customerId, movieId });

      expect(res.status).toBe(403);
    });

    it('should return 400 if customerId is invalid', async () => {
      const token = getToken(user);
      const res = await retunrRental(token, { customerId: '1234', movieId });

      expect(res.status).toBe(400);
    });

    it('should return 400 if movieId is invalid', async () => {
      const token = getToken(user);
      const res = await retunrRental(token, { customerId, movieId: '1234' });

      expect(res.status).toBe(400);
    });

    it('should return 404 if no rental found for this customer/movie', async () => {
      const token = getToken(user);
      await Rental.remove({});
      const res = await retunrRental(token, { customerId, movieId });

      expect(res.status).toBe(404);
    });

    it('should return 400 if rental is already processed', async () => {
      rental.dateReturned = new Date();
      await rental.save();

      const token = getToken(user);
      const res = await retunrRental(token, { customerId, movieId });

      expect(res.status).toBe(400);
    });

    it('should return 200 if valid request', async () => {
      const token = getToken(user);
      const res = await retunrRental(token, { customerId, movieId });

      expect(res.status).toBe(200);
    });

    it('should set the returnedDate if valid request', async () => {
      const token = getToken(user);
      await retunrRental(token, { customerId, movieId });

      const rentalInDb = await Rental.findById(rental._id); // ???????
      const delta = new Date() - rentalInDb.dateReturned;

      expect(delta).toBeLessThan(10 * 1000);
    });

    it('should calculate rental fee if valid request', async () => {
      rental.dateOut = moment().add(-7, 'days').toDate();
      await rental.save();

      const token = getToken(user);
      const res = await retunrRental(token, { customerId, movieId });

      const rentalInDb = await Rental.findById(rental._id); // ???????

      expect(rentalInDb.rentalFee).toBe(7 * rental.movie.dailyRentalRate);
    });

    it('should increase the movie stock if valid request', async () => {
      const token = getToken(user);
      await retunrRental(token, { customerId, movieId });

      const movieInDb = await Movie.findById(movieId);

      expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });

    it('should return the rental if valid request', async () => {
      const token = getToken(user);
      const res = await retunrRental(token, { customerId, movieId });

      // const rentalInDb = await Rental.findById(rental._id);

      expect(Object.keys(res.body)).toEqual(expect.arrayContaining(
        ['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie'])
      );
    });
  });
});

function getToken(user={}) {
  return new User(user).generateAuthToken();
}

function retunrRental(token, reqBody) {
  return request(server)
    .post(`/api/returns`)
    .set('x-auth-token', token)
    .send(reqBody);
}