const request = require('supertest');
const { factory } = require('factory-girl');
const jwt = require('jsonwebtoken');

const {
  resHashedPasswordMock,
  resComparePasswordMock,
  rejComparePasswordMock
} = require('../../mocks/bcrypt');
const app = require('../../../app');
const { factoryByModel } = require('../../factory/factory_by_models');
const { userSignUpErrorsMessages, userSignInErrorsMessages } = require('../../errors/user');

factoryByModel('users');

describe('POST /users', () => {
  let mockedPassword = {};
  let responseKeys = {};
  let successUser = {};
  let repeatedEmailUser = {};
  let successResponse = {};
  let repeatedEmailResponse = {};
  let userCreationErrorCode = {};
  beforeAll(async () => {
    mockedPassword = await resHashedPasswordMock('passWord58');
    responseKeys = await [
      'id',
      'firstName',
      'lastName',
      'email',
      'password',
      'admin',
      'updatedAt',
      'createdAt',
      'deleted_at'
    ];
    successUser = await factory.build('users').then(dummy => dummy.dataValues);
    successUser.password = 'passWord58';
    successUser.email += '@wolox.com.ar';
    successResponse = await request(app)
      .post('/users')
      .send({
        first_name: successUser.firstName,
        last_name: successUser.lastName,
        email: successUser.email,
        password: successUser.password
      });
    await factory.create('users', {
      password: mockedPassword,
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
    userCreationErrorCode = 'user_creation_error';
  });
  describe('Successful case', () => {
    describe('Creates a new user when request has valid parameters', () => {
      it('should have status code 201', () => {
        expect(successResponse.statusCode).toEqual(201);
      });
      it('should have the proper keys', () => {
        expect(Object.keys(successResponse.body)).toEqual(responseKeys);
      });
      it("should have an email correspondig to wolox's domain", () => {
        expect(successResponse.body.email.includes('@wolox.com.ar')).toBe(true);
      });
    });
  });

  describe('Failure case', () => {
    describe('Creation fails when the email adress already exist in the database', () => {
      it('should have status code 422', () => {
        expect(repeatedEmailResponse.statusCode).toEqual(422);
      });
      it('should respond with repeated email error message', () => {
        expect(repeatedEmailResponse.body.message).toEqual(
          userSignUpErrorsMessages.repeatedEmailErrorMessage
        );
      });
      it('should respond with user creation internal code', () => {
        expect(repeatedEmailResponse.body.internal_code).toEqual(userCreationErrorCode);
      });
    });
  });
});

describe('POST /users/sessions', () => {
  let mockedPassword = {};
  let successUser = {};
  let responseToken = {};
  let successResponse = {};
  let unregisterdUserResponse = {};
  let wrongPasswordResponse = {};
  let userLoginErrorCode = {};
  beforeAll(async () => {
    mockedPassword = await resHashedPasswordMock('passWord58');
    successUser = await factory.create('users', {
      password: mockedPassword,
      email: 'fake@wolox.com.ar'
    });
    await resComparePasswordMock();
    successResponse = await request(app)
      .post('/users/sessions')
      .send({
        email: 'fake@wolox.com.ar',
        password: 'passWord58'
      });
    responseToken = jwt.sign(
      {
        id: successUser.id,
        firstName: successUser.firstName,
        lastName: successUser.lastName,
        admin: successUser.admin
      },
      process.env.TOKEN_SECRET
    );
    unregisterdUserResponse = await request(app)
      .post('/users/sessions')
      .send({
        email: 'unregisterd@wolox.com.ar',
        password: 'unregistered'
      });
    await rejComparePasswordMock();
    wrongPasswordResponse = await request(app)
      .post('/users/sessions')
      .send({
        email: 'fake@wolox.com.ar',
        password: 'wrongPassword'
      });
    userLoginErrorCode = 'user_login_error';
  });
  describe('Success case', () => {
    describe('Logs in a user when request has valid parameters', () => {
      it('should have status code 200', () => {
        expect(successResponse.statusCode).toEqual(200);
      });
      it('should contain the corresponding jwt', () => {
        expect(successResponse.body.token).toEqual(responseToken);
      });
    });
  });

  describe('Failure cases', () => {
    describe('Does not log in a user when the user is not registerd', () => {
      it('should have status code 401', () => {
        expect(unregisterdUserResponse.statusCode).toEqual(401);
      });
      it('should respond with unregisterd user error message', () => {
        expect(unregisterdUserResponse.body.message).toEqual(
          userSignInErrorsMessages.unauthorizedErrorMessage
        );
      });
      it('should respond with user login internal code', () => {
        expect(unregisterdUserResponse.body.internal_code).toEqual(userLoginErrorCode);
      });
    });

    describe('Does not log in a user when the password is incorrect', () => {
      it('should have status code 401', () => {
        expect(wrongPasswordResponse.statusCode).toEqual(401);
      });
      it('should respond with wrong password error message', () => {
        expect(wrongPasswordResponse.body.message).toEqual(userSignInErrorsMessages.unauthorizedErrorMessage);
      });
      it('should respond with user login internal code', () => {
        expect(wrongPasswordResponse.body.internal_code).toEqual(userLoginErrorCode);
      });
    });
  });
});
