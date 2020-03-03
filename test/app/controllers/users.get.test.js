const request = require('supertest');
const { factory } = require('factory-girl');

const { resHashedPasswordMock, resComparePasswordMock } = require('../../mocks/bcrypt');
const app = require('../../../app');
const { factoryByModel } = require('../../factory/factory_by_models');
const { authFailedErrorMessage } = require('../../errors/user').usersListErrorMessages;

factoryByModel('users');

describe('GET /users', () => {
  let defaultLimit = {};
  let defaultPage = {};
  let limit = {};
  let page = {};
  let mockedPassword = {};
  let token = {};
  let successResponseKeys = {};
  let emptyBodyResponse = {};
  let successResponse = {};
  let unauthorizedResponse = {};
  let userLoginErrorCode = {};
  beforeAll(async () => {
    defaultLimit = 3;
    defaultPage = 1;
    limit = 4;
    page = 2;
    await resComparePasswordMock();
    mockedPassword = await resHashedPasswordMock('passWord58');
    await factory.createMany('users', 9);
    await factory.create('users', {
      password: mockedPassword,
      email: 'success.user@wolox.com.ar'
    });
    token = await request(app)
      .post('/users/sessions')
      .send({
        email: 'success.user@wolox.com.ar',
        password: 'passWord58'
      })
      .then(response => response.body.token);
    successResponseKeys = [
      'page',
      'count',
      'limit',
      'offset',
      'total_pages',
      'total_count',
      'previous_page',
      'current_page',
      'next_page'
    ];
    emptyBodyResponse = await request(app)
      .get('/users')
      .set('Authorization', token);
    successResponse = await request(app)
      .get('/users')
      .set('Authorization', token)
      .query({ limit, page });
    unauthorizedResponse = await request(app)
      .get('/users')
      .query({ limit, page });
    userLoginErrorCode = 'user_login_error';
  });

  describe('Successful cases', () => {
    describe('It succeeds when the request has an empty body', () => {
      it('should have status code 200', () => {
        expect(emptyBodyResponse.statusCode).toEqual(200);
      });
      it('should have a paginated response', () => {
        expect(Object.keys(emptyBodyResponse.body)).toEqual(successResponseKeys);
      });
      it('should have the default limit', () => {
        expect(emptyBodyResponse.body.limit).toEqual(defaultLimit);
      });
      it('should have the default page', () => {
        expect(emptyBodyResponse.body.current_page).toEqual(defaultPage);
      });
    });
    describe('It succeeds when the request has specified limit and page', () => {
      it('should have status code 200', () => {
        expect(successResponse.statusCode).toEqual(200);
      });
      it('should have a paginated response', () => {
        expect(Object.keys(successResponse.body)).toEqual(successResponseKeys);
      });
      it('should respond according to the specified limit', () => {
        expect(successResponse.body.limit).toEqual(limit);
      });
      it('should respond according to the specified page number', () => {
        expect(successResponse.body.current_page).toEqual(page);
      });
    });
  });

  describe('Failure case', () => {
    describe('It fails when user is not authorized', () => {
      it('should have status code 401', () => {
        expect(unauthorizedResponse.statusCode).toEqual(401);
      });
      it('should respond with failed authentication error message', () => {
        expect(unauthorizedResponse.body.message).toEqual(authFailedErrorMessage);
      });
      it('should respond with login error internal code', () => {
        expect(unauthorizedResponse.body.internal_code).toEqual(userLoginErrorCode);
      });
    });
  });
});
