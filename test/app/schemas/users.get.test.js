const request = require('supertest');
const { factory } = require('factory-girl');
const bcrypt = require('bcrypt');

const app = require('../../../app');
const config = require('../../../config/index');
const { factoryByModel } = require('../../factory/factory_by_models');
const {
  invalidLimitErrorMessage,
  invalidPageErrorMessage
} = require('../../errors/user').usersListErrorMessages;

const { saltRounds } = config.common.bcrypt;
const validationErrorCode = 'validation_error';

factoryByModel('users');

describe('GET /users (VALIDATION)', () => {
  let invalidTypeLimit = {};
  let invalidTypePage = {};
  let token = {};
  let invalidLimitResponse = {};
  let invalidPageResponse = {};
  beforeAll(async () => {
    invalidTypeLimit = 'limite';
    invalidTypePage = 'pagina';
    await factory.create('users', {
      password: bcrypt.hash('passWord58', saltRounds),
      email: 'success.user@wolox.com.ar'
    });
    token = await request(app)
      .post('/users/sessions')
      .send({
        email: 'success.user@wolox.com.ar',
        password: 'passWord58'
      })
      .then(response => response.body.token);
    invalidLimitResponse = await request(app)
      .get('/users')
      .set('Authorization', token)
      .query({ limit: invalidTypeLimit });
    invalidPageResponse = await request(app)
      .get('/users')
      .set('Authorization', token)
      .query({ page: invalidTypePage });
  });
  describe('Failure cases due to invalid request', () => {
    describe('Request fails because of body with invalid limit parameter', () => {
      it('should have status code 400', () => {
        expect(invalidLimitResponse.statusCode).toEqual(400);
      });
      it('should respond with invalid limit error message', () => {
        expect(invalidLimitResponse.body.message).toEqual(invalidLimitErrorMessage);
      });
      it('should respond with validation error internal code', () => {
        expect(invalidLimitResponse.body.internal_code).toEqual(validationErrorCode);
      });
    });

    describe('Request fails because of body with invalid page parameter', () => {
      it('should have status code 400', () => {
        expect(invalidPageResponse.statusCode).toEqual(400);
      });
      it('should respond with invalid page error message', () => {
        expect(invalidPageResponse.body.message).toEqual(invalidPageErrorMessage);
      });
      it('should respond with validation error internal code', () => {
        expect(invalidPageResponse.body.internal_code).toEqual(validationErrorCode);
      });
    });
  });
});
