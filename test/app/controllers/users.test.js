const request = require('supertest');
const { factory } = require('factory-girl');
const bcrypt = require('bcrypt');

const app = require('../../../app');
const config = require('../../../config/index');
const { factoryByModel } = require('../../factory/factory_by_models');
const { userSignUpErrorsMessages, userSignInErrorsMessages } = require('../../errors/user');

const { saltRounds } = config.common.bcrypt;

factoryByModel('users');

describe('POST /users', () => {
  let responseKeys = {};
  let user = {};
  let wrongEmailUser = {};
  let nonAlphPasswordUser = {};
  let shortPasswordUser = {};
  let repeatedEmailUser = {};
  let successResponse = {};
  let emptyParamsResponse = {};
  let wrongEmailResponse = {};
  let nonAlphPasswordResponse = {};
  let shortPasswordResponse = {};
  let repeatedEmailResponse = {};
  let repeatedEmailErrorMessage = {};
  let userCreationErrorCode = {};
  let validationErrorCode = {};
  beforeAll(async () => {
    responseKeys = await [
      'id',
      'firstName',
      'lastName',
      'email',
      'password',
      'updatedAt',
      'createdAt',
      'deleted_at'
    ];
    user = await factory.build('users').then(dummy => dummy.dataValues);
    user.password = 'passWord58';
    user.email += '@wolox.com.ar';
    successResponse = await request(app)
      .post('/users')
      .send({
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        password: user.password
      });
    validationErrorCode = 'validation_error';
    emptyParamsResponse = await request(app)
      .post('/users')
      .send({
        first_name: '',
        last_name: '',
        email: '',
        password: ''
      });
    wrongEmailUser = await factory.build('users').then(dummy => dummy.dataValues);
    wrongEmailUser.password = 'passWord58';
    wrongEmailUser.email += '@gmail.com.ar';
    wrongEmailResponse = await request(app)
      .post('/users')
      .send({
        first_name: wrongEmailUser.firstName,
        last_name: wrongEmailUser.lastName,
        email: wrongEmailUser.email,
        password: wrongEmailUser.password
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
    await factory.create('users', {
      password: bcrypt.hash('passWord58', saltRounds),
      email: 'repeated@wolox.com.ar'
    });
    repeatedEmailUser = await factory.build('users').then(dummy => dummy.dataValues);
    repeatedEmailUser.password = 'passWord58';
    repeatedEmailUser.email = 'repeated@wolox.com.ar';
    repeatedEmailResponse = await request(app)
      .post('/users')
      .send({
        first_name: repeatedEmailUser.firstName,
        last_name: repeatedEmailUser.lastName,
        email: repeatedEmailUser.email,
        password: repeatedEmailUser.password
      });
    repeatedEmailErrorMessage = 'User for repeated@wolox.com.ar already exists!';
    userCreationErrorCode = 'user_creation_error';
  });
  describe('Successful cases', () => {
    describe('With valid parameters', () => {
      it('should have status code 201', () => {
        expect(successResponse.statusCode).toEqual(201);
      });
      it('should have the proper keys', () => {
        expect(Object.keys(successResponse.body)).toEqual(responseKeys);
      });
      it("should have an email correspondig to wolox's domain", () => {
        expect(successResponse.body.email.slice(-13)).toEqual('@wolox.com.ar');
      });
    });
  });

  describe('Failure cases', () => {
    describe('With empty params', () => {
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

    describe('With wrong email domain', () => {
      it('should have status code 400', () => {
        expect(wrongEmailResponse.statusCode).toEqual(400);
      });
      it('should respond with wrong email error message', () => {
        expect(wrongEmailResponse.body.message).toEqual(userSignUpErrorsMessages.wrongEmailErrorMessage);
      });
      it('should respond with validation error internal code', () => {
        expect(emptyParamsResponse.body.internal_code).toEqual(validationErrorCode);
      });
    });

    describe('With non alphanumeric password', () => {
      it('should have status code 400', () => {
        expect(nonAlphPasswordResponse.statusCode).toEqual(400);
      });
      it('should respond with not alphanumeric password error message', () => {
        expect(nonAlphPasswordResponse.body.message).toEqual(
          userSignUpErrorsMessages.wrongPasswordErrorMessage
        );
      });
      it('should respond with validation error internal code', () => {
        expect(nonAlphPasswordResponse.body.internal_code).toEqual(validationErrorCode);
      });
    });

    describe('With too short password', () => {
      it('should have status code 400', () => {
        expect(shortPasswordResponse.statusCode).toEqual(400);
      });
      it('should respond with short password error message', () => {
        expect(shortPasswordResponse.body.message).toEqual(
          userSignUpErrorsMessages.wrongPasswordErrorMessage
        );
      });
      it('should respond with validation error internal code', () => {
        expect(shortPasswordResponse.body.internal_code).toEqual(validationErrorCode);
      });
    });

    describe('With repeated email address', () => {
      it('should have status code 422', () => {
        expect(repeatedEmailResponse.statusCode).toEqual(422);
      });
      it('should respond with repeated email error message', () => {
        expect(repeatedEmailResponse.body.message).toEqual(repeatedEmailErrorMessage);
      });
      it('should respond with user creation internal code', () => {
        expect(repeatedEmailResponse.body.internal_code).toEqual(userCreationErrorCode);
      });
    });
  });
});

describe('POST /users/sessions', () => {
  let successResponse = {};
  let emptyParamsResponse = {};
  let validationErrorCode = {};
  let wrongEmailResponse = {};
  let wrongPasswordResponse = {};
  let userLoginErrorCode = {};
  beforeAll(async () => {
    await factory.create('users', {
      password: bcrypt.hash('passWord58', saltRounds),
      email: 'fake@wolox.com.ar'
    });
    successResponse = await request(app)
      .post('/users/sessions')
      .send({
        email: 'fake@wolox.com.ar',
        password: 'passWord58'
      });
    validationErrorCode = 'validation_error';
    emptyParamsResponse = await request(app)
      .post('/users/sessions')
      .send({
        email: '',
        password: ''
      });
    wrongEmailResponse = await request(app)
      .post('/users/sessions')
      .send({
        email: 'fake@gmail.com.ar',
        password: 'passWord58'
      });
    wrongPasswordResponse = await request(app)
      .post('/users/sessions')
      .send({
        email: 'fake@wolox.com.ar',
        password: 'wrongPassword'
      });
    userLoginErrorCode = 'user_login_error';
  });
  describe('Success case', () => {
    describe('With valid parameters', () => {
      it('should have status code 200', () => {
        expect(successResponse.statusCode).toEqual(200);
      });
    });
  });

  describe('Failure cases', () => {
    describe('With empty params', () => {
      it('should have satatus code 400', () => {
        expect(emptyParamsResponse.statusCode).toEqual(400);
      });
      it('should respond with empty parameters error message', () => {
        expect(emptyParamsResponse.body.message).toEqual(userSignInErrorsMessages.emptyBodyErrorMessage);
      });
      it('should respond with validation error internal code', () => {
        expect(emptyParamsResponse.body.internal_code).toEqual(validationErrorCode);
      });
    });

    describe('With invalid email', () => {
      it('should have satatus code 400', () => {
        expect(wrongEmailResponse.statusCode).toEqual(400);
      });
      it('should respond with corresponding error message', () => {
        expect(wrongEmailResponse.body.message).toEqual(userSignInErrorsMessages.wrongEmailErrorMessage);
      });
      it('should respond with validation error internal code', () => {
        expect(wrongEmailResponse.body.internal_code).toEqual(validationErrorCode);
      });
    });

    describe('With wrong password', () => {
      it('should have satatus code 401', () => {
        expect(wrongPasswordResponse.statusCode).toEqual(401);
      });
      it('should respond with invalid password error message', () => {
        expect(wrongPasswordResponse.body.message).toEqual(
          userSignInErrorsMessages.invalidPasswordErrorMessage
        );
      });
      it('should respond with user login internal code', () => {
        expect(wrongPasswordResponse.body.internalCode).toEqual(userLoginErrorCode);
      });
    });
  });
});
