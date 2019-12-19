const request = require('supertest');
const app = require('../../../app');

describe('Create User', () => {
  describe('With valid params', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/users')
        .send({
          first_name: 'Alberto',
          last_name: 'Alvarez',
          email: 'alberto.alvarez@wolox.com.ar',
          password: 'albertAlv85'
        });
      expect(res.statusCode).toEqual(201);
    });
  });

  describe('With empty params', () => {
    it("shouldn't create a new user", async () => {
      const res = await request(app)
        .post('/users')
        .send({
          first_name: '',
          last_name: '',
          email: '',
          password: ''
        });
      expect(res.statusCode).toEqual(500);
    });
  });

  describe('With wrong email domain', () => {
    it("shouldn't create a new user", async () => {
      const res = await request(app)
        .post('/users')
        .send({
          first_name: 'Alberto',
          last_name: 'Alvarez',
          email: 'alberto.alvarez@gmail.com',
          password: 'albertAlv85'
        });
      expect(res.statusCode).toEqual(500);
    });
  });

  describe('With non alphanumeric password', () => {
    it("shouldn't create a new user", async () => {
      const res = await request(app)
        .post('/users')
        .send({
          first_name: 'Alberto',
          last_name: 'Alvarez',
          email: 'alberto.alvarez@wolox.com.ar',
          password: 'albert-alv_85'
        });
      expect(res.statusCode).toEqual(500);
    });
  });

  describe('With too short password', () => {
    it("shouldn't create a new user", async () => {
      const res = await request(app)
        .post('/users')
        .send({
          first_name: 'Alberto',
          last_name: 'Alvarez',
          email: 'alberto.alvarez@wolox.com.ar',
          password: 'albalv'
        });
      expect(res.statusCode).toEqual(500);
    });
  });
});
