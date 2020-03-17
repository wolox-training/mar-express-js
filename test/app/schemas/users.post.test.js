const request = require('supertest');
const { factory } = require('factory-girl');

const { resolveHashPasswordMock } = require('../../mocks/bcrypt');
const app = require('../../../app');
const { factoryByModel } = require('../../factory/factory_by_models');
const { userSignUpErrorsMessages, userSignInErrorsMessages } = require('../../errors/user');

const validationErrorCode = 'validation_error';

factoryByModel('users');

describe('POST /users (VALIDATION)', () => {
  let invalidEmailUser = {};
  let nonAlphPasswordUser = {};
  let shortPasswordUser = {};
  let emptyParamsResponse = {};
  let invalidEmailResponse = {};
  let nonAlphPasswordResponse = {};
  let shortPasswordResponse = {};
  beforeAll(async () => {
    emptyParamsResponse = await request(app)
      .post('/users')
      .send({
        first_name: '',
        last_name: '',
        email: '',
        password: ''
      });
    invalidEmailUser = await factory.build('users').then(dummy => dummy.dataValues);
    invalidEmailUser.password = 'passWord58';
    invalidEmailUser.email += '@gmail.com.ar';
    invalidEmailResponse = await request(app)
      .post('/users')
      .send({
        first_name: invalidEmailUser.firstName,
        last_name: invalidEmailUser.lastName,
        email: invalidEmailUser.email,
        password: invalidEmailUser.password
      });
    nonAlphPasswordUser = await factory.build('users').then(dummy => dummy.dataValues);
    nonAlphPasswordUser.password = '_pass-Word_';
    nonAlphPasswordUser.email += '@wolox.com.ar';
    nonAlphPasswordResponse = await request(app)
      .post('/users')
      .send({
        first_name: nonAlphPasswordUser.firstName,
        last_name: nonAlphPasswordUser.lastName,
        email: nonAlphPasswordUser.email,
        password: nonAlphPasswordUser.password
      });
    shortPasswordUser = await factory.build('users').then(dummy => dummy.dataValues);
    shortPasswordUser.password = 'pass';
    shortPasswordUser.email += '@wolox.com.ar';
    shortPasswordResponse = await request(app)
      .post('/users')
      .send({
        first_name: shortPasswordUser.firstName,
        last_name: shortPasswordUser.lastName,
        email: shortPasswordUser.email,
        password: shortPasswordUser.password
      });
  });

  describe('Failure cases due to invalid request', () => {
    describe('Request fails because of body with empty parameters', () => {
      it('should have status code 400', () => {
        expect(emptyParamsResponse.statusCode).toEqual(400);
      });
      it('should respond with empty parameters error message', () => {
        expect(emptyParamsResponse.body.message).toEqual(userSignUpErrorsMessages.emptyBodyErrorMessage);
      });
      it('should respond with validation error internal code', () => {
        expect(emptyParamsResponse.body.internal_code).toEqual(validationErrorCode);
      });
    });

    describe('Request fails because of body with invalid email domain', () => {
      it('should have status code 400', () => {
        expect(invalidEmailResponse.statusCode).toEqual(400);
      });
      it('should respond with invalid email error message', () => {
        expect(invalidEmailResponse.body.message).toEqual(userSignUpErrorsMessages.invalidEmailErrorMessage);
      });
      it('should respond with validation error internal code', () => {
        expect(emptyParamsResponse.body.internal_code).toEqual(validationErrorCode);
      });
    });

    describe('Request fails because of body with non alphanumeric password', () => {
      it('should have status code 400', () => {
        expect(nonAlphPasswordResponse.statusCode).toEqual(400);
      });
      it('should respond with invalid password error message', () => {
        expect(nonAlphPasswordResponse.body.message).toEqual(
          userSignUpErrorsMessages.invalidPasswordErrorMessage
        );
      });
      it('should respond with validation error internal code', () => {
        expect(nonAlphPasswordResponse.body.internal_code).toEqual(validationErrorCode);
      });
    });

    describe('Request fails because of body with too short password', () => {
      it('should have status code 400', () => {
        expect(shortPasswordResponse.statusCode).toEqual(400);
      });
      it('should respond with invalid password error message', () => {
        expect(shortPasswordResponse.body.message).toEqual(
          userSignUpErrorsMessages.invalidPasswordErrorMessage
        );
      });
      it('should respond with validation error internal code', () => {
        expect(shortPasswordResponse.body.internal_code).toEqual(validationErrorCode);
      });
    });
  });
});

describe('POST /users/sessions (VALIDATION)', () => {
  let mockedPassword = {};
  let emptyParamsResponse = {};
  let invalidEmailResponse = {};
  let invalidPasswordResponse = {};
  beforeAll(async () => {
    mockedPassword = await resolveHashPasswordMock('passWord58');
    await factory.create('users', {
      password: mockedPassword,
      email: 'fake@wolox.com.ar'
    });
    emptyParamsResponse = await request(app)
      .post('/users/sessions')
      .send({
        email: '',
        password: ''
      });
    invalidEmailResponse = await request(app)
      .post('/users/sessions')
      .send({
        email: 'fake@gmail.com.ar',
        password: 'passWord58'
      });
    invalidPasswordResponse = await request(app)
      .post('/users/sessions')
      .send({
        email: 'fake@wolox.com.ar',
        password: 'invalid-pass'
      });
  });

  describe('Failure cases due to invalid request', () => {
    describe('Request fails because of body with empty parameters', () => {
      it('should have status code 400', () => {
        expect(emptyParamsResponse.statusCode).toEqual(400);
      });
      it('should respond with empty parameters error message', () => {
        expect(emptyParamsResponse.body.message).toEqual(userSignInErrorsMessages.emptyBodyErrorMessage);
      });
      it('should respond with validation error internal code', () => {
        expect(emptyParamsResponse.body.internal_code).toEqual(validationErrorCode);
      });
    });

    describe('Request fails because of body with invalid email', () => {
      it('should have status code 400', () => {
        expect(invalidEmailResponse.statusCode).toEqual(400);
      });
      it('should respond with invalid email error message', () => {
        expect(invalidEmailResponse.body.message).toEqual(userSignInErrorsMessages.invalidEmailErrorMessage);
      });
      it('should respond with validation error internal code', () => {
        expect(invalidEmailResponse.body.internal_code).toEqual(validationErrorCode);
      });
    });

    describe('Request fails because of body with invalid password', () => {
      it('should have status code 400', () => {
        expect(invalidPasswordResponse.statusCode).toEqual(400);
      });
      it('should respond with invalid password error messafe', () => {
        expect(invalidPasswordResponse.body.message).toEqual(
          userSignInErrorsMessages.invalidPasswordErrorMessage
        );
      });
      it('should respond with validation error internal code', () => {
        expect(invalidPasswordResponse.body.internal_code).toEqual(validationErrorCode);
      });
    });
  });
});
