const request = require('supertest');
const { factory } = require('factory-girl');

const app = require('../../../app');
const { factoryByModel } = require('../../factory/factory_by_models');

factoryByModel('users');

describe('POST /users', () => {
  describe('Successful cases', () => {
    const responseKeys = [
      'id',
      'firstName',
      'lastName',
      'email',
      'password',
      'updatedAt',
      'createdAt',
      'deleted_at'
    ];
    describe('With valid params', () => {
      it('should create a new user', async () => {
        const user = await factory.build('users').then(dummy => dummy.dataValues);
        user.password = 'passWord58';
        user.email += '@wolox.com.ar';
        const res = await request(app)
          .post('/users')
          .send({
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            password: user.password
          });
        expect(res.statusCode).toEqual(201);
        expect(Object.keys(res.body)).toEqual(responseKeys);
        expect(res.body.email.slice(-13)).toEqual('@wolox.com.ar');
      });
    });
  });

  describe('Failure cases', () => {
    const failureMessage = 'Invalid params!';
    const internalCode = 'user_creation_error';
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
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual(failureMessage);
        expect(res.body.internal_code).toEqual(internalCode);
      });
    });

    describe('With wrong email domain', () => {
      it("shouldn't create a new user", async () => {
        const user = await factory.build('users').then(dummy => dummy.dataValues);
        user.password = 'passWord58';
        user.email += '@gmail.com.ar';
        const res = await request(app)
          .post('/users')
          .send({
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            password: user.password
          });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual(failureMessage);
        expect(res.body.internal_code).toEqual(internalCode);
      });
    });

    describe('With non alphanumeric password', () => {
      it("shouldn't create a new user", async () => {
        const user = await factory.build('users').then(dummy => dummy.dataValues);
        user.password = '_pass-Word_';
        user.email += '@wolox.com.ar';
        const res = await request(app)
          .post('/users')
          .send({
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            password: user.password
          });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual(failureMessage);
        expect(res.body.internal_code).toEqual(internalCode);
      });
    });

    describe('With too short password', () => {
      it("shouldn't create a new user", async () => {
        const user = await factory.build('users').then(dummy => dummy.dataValues);
        user.password = 'pass';
        user.email += '@wolox.com.ar';
        const res = await request(app)
          .post('/users')
          .send({
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            password: user.password
          });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual(failureMessage);
        expect(res.body.internal_code).toEqual(internalCode);
      });
    });
  });
});
