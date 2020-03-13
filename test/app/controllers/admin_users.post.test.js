const request = require('supertest');
const { factory } = require('factory-girl');

const { failedJWTVerifyMock, succeedJWTVerifyMock } = require('../../mocks/jwt');
const app = require('../../../app');
const { factoryByModel } = require('../../factory/factory_by_models');
const { adminUserSignUpErrorMessages } = require('../../errors/user');

factoryByModel('users');

describe('POST /admin/users', () => {
  let responseKeys = {};
  let updateResponseKeys = {};
  let userCreationErrorCode = {};
  let userLoginErrorCode = {};
  let adminVerification = {};
  let successUser = {};
  let successResponse = {};
  let updateUser = {};
  let successUpdateResponse = {};
  let repeatedUser = {};
  let repeatedEmailResponse = {};
  let failedUser = {};
  let noAuthenticatedUserResponse = {};
  beforeAll(async () => {
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
    updateResponseKeys = await [
      'id',
      'firstName',
      'lastName',
      'email',
      'password',
      'admin',
      'createdAt',
      'updatedAt'
    ];
    userCreationErrorCode = 'user_creation_error';
    userLoginErrorCode = 'user_login_error';
    adminVerification = {
      id: 1,
      firstName: 'admin',
      lastname: 'user',
      admin: true
    };
    successUser = await factory.build('users').then(dummy => dummy.dataValues);
    successUser.password = 'passWord58';
    successUser.email += '@wolox.com.ar';
    await succeedJWTVerifyMock(adminVerification);
    successResponse = await request(app)
      .post('/admin/users')
      .send({
        first_name: successUser.firstName,
        last_name: successUser.lastName,
        email: successUser.email,
        password: successUser.password
      });
    updateUser = await factory.create('users', {
      email: 'update.user@wolox.com.ar',
      password: 'passWord59',
      admin: false
    });
    await succeedJWTVerifyMock(adminVerification);
    successUpdateResponse = await request(app)
      .post('/admin/users')
      .send({
        first_name: updateUser.firstName,
        last_name: updateUser.lastName,
        email: updateUser.email,
        password: updateUser.password
      });
    repeatedUser = await factory.create('users', {
      email: 'repeated@wolox.com.ar',
      password: 'passWord60',
      admin: true
    });
    await succeedJWTVerifyMock(adminVerification);
    repeatedEmailResponse = await request(app)
      .post('/admin/users')
      .send({
        first_name: repeatedUser.firstName,
        last_name: repeatedUser.lastName,
        email: repeatedUser.email,
        password: repeatedUser.password
      });
    failedUser = await factory.build('users').then(dummy => dummy.dataValues);
    failedUser.password = 'passWord61';
    failedUser.email += '@wolox.com.ar';
    await failedJWTVerifyMock('Authentication failed!');
    noAuthenticatedUserResponse = await request(app)
      .post('/admin/users')
      .send({
        first_name: failedUser.firstName,
        last_name: failedUser.lastName,
        email: failedUser.email,
        password: failedUser.password
      });
  });
  describe('Successful cases', () => {
    describe('Creates a new admin user when request has valid parameters', () => {
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
    describe('Updates a regular user to admin when request has valid parameters', () => {
      it('should have status code 200', () => {
        expect(successUpdateResponse.statusCode).toEqual(200);
      });
      it('should have the proper keys', () => {
        expect(Object.keys(successUpdateResponse.body)).toEqual(updateResponseKeys);
      });
      it('should have admin attribute set to true', () => {
        expect(successUpdateResponse.body.admin).toEqual(true);
      });
    });
  });

  describe('Failure cases', () => {
    describe('Creation fails when the email adress already exist in the database', () => {
      it('should have status code 422', () => {
        expect(repeatedEmailResponse.statusCode).toEqual(422);
      });
      it('should respond with repeated email error message', () => {
        expect(repeatedEmailResponse.body.message).toEqual(
          adminUserSignUpErrorMessages.repeatedAdminEmailErrorMessage
        );
      });
      it('should respond with user creation internal code', () => {
        expect(repeatedEmailResponse.body.internal_code).toEqual(userCreationErrorCode);
      });
    });
    describe('Creation fails when the there is no admin user authenticated', () => {
      it('should have status code 401', () => {
        expect(noAuthenticatedUserResponse.statusCode).toEqual(401);
      });
      it('should respond with failed authentication error message', () => {
        expect(noAuthenticatedUserResponse.body.message).toEqual(
          adminUserSignUpErrorMessages.unauthorizedErrorMessage
        );
      });
      it('should respond with login error internal code', () => {
        expect(noAuthenticatedUserResponse.body.internal_code).toEqual(userLoginErrorCode);
      });
    });
  });
});
