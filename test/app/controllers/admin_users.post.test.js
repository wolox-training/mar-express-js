const request = require('supertest');
const { factory } = require('factory-girl');

const { resHashedPasswordMock, resComparePasswordMock } = require('../../mocks/bcrypt');
const app = require('../../../app');
const { factoryByModel } = require('../../factory/factory_by_models');
const { adminUserSignUpErrorMessages } = require('../../errors/user');

factoryByModel('users');

describe('POST /admin/users', () => {
  let mockedAdminPass = {};
  let mockedUpdatePass = {};
  let mockedRepeatedPass = {};
  let mockedExistingPass = {};
  let responseKeys = {};
  let updateResponseKeys = {};
  let token = {};
  let failedToken = {};
  let successUser = {};
  let updateUser = {};
  let repeatedEmailUser = {};
  let failureUser = {};
  let successResponse = {};
  let successUpdateResponse = {};
  let repeatedEmailResponse = {};
  let noUserResponse = {};
  let noAdminUserResponse = {};
  let userCreationErrorCode = {};
  let userLoginErrorCode = {};
  beforeAll(async () => {
    await resComparePasswordMock();
    mockedAdminPass = await resHashedPasswordMock('adminPass60');
    mockedUpdatePass = await resHashedPasswordMock('updateUserPass60');
    mockedRepeatedPass = await resHashedPasswordMock('passWord58');
    mockedExistingPass = await resHashedPasswordMock('existingUserPass60');
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
    await factory.create('users', {
      password: mockedAdminPass,
      email: 'admin@wolox.com.ar',
      admin: true
    });
    token = await request(app)
      .post('/users/sessions')
      .send({
        email: 'admin@wolox.com.ar',
        password: 'adminPass60'
      })
      .then(response => response.body.token);
    successUser = await factory.build('users').then(dummy => dummy.dataValues);
    successUser.password = 'passWord58';
    successUser.email += '@wolox.com.ar';
    successResponse = await request(app)
      .post('/admin/users')
      .set('Authorization', token)
      .send({
        first_name: successUser.firstName,
        last_name: successUser.lastName,
        email: successUser.email,
        password: successUser.password
      });
    updateUser = await factory.create('users', {
      password: mockedUpdatePass,
      email: 'update.user@wolox.com.ar',
      admin: false
    });
    successUpdateResponse = await request(app)
      .post('/admin/users')
      .set('Authorization', token)
      .send({
        first_name: updateUser.firstName,
        last_name: updateUser.lastName,
        email: updateUser.email,
        password: 'updateUserPass60'
      });
    await factory.create('users', {
      password: mockedRepeatedPass,
      email: 'repeated@wolox.com.ar',
      admin: true
    });
    repeatedEmailUser = await factory.build('users').then(dummy => dummy.dataValues);
    repeatedEmailUser.password = 'passWord58';
    repeatedEmailUser.email = 'repeated@wolox.com.ar';
    repeatedEmailResponse = await request(app)
      .post('/admin/users')
      .set('Authorization', token)
      .send({
        first_name: repeatedEmailUser.firstName,
        last_name: repeatedEmailUser.lastName,
        email: repeatedEmailUser.email,
        password: repeatedEmailUser.password
      });
    failureUser = await factory.build('users').then(dummy => dummy.dataValues);
    failureUser.password = 'failurePass';
    failureUser.email = 'failure@wolox.com.ar';
    noUserResponse = await request(app)
      .post('/admin/users')
      .send({
        firstName: failureUser.firstName,
        lastName: failureUser.lastName,
        email: failureUser.email,
        password: failureUser.password
      });
    await factory.create('users', {
      password: mockedExistingPass,
      email: 'existing.user@wolox.com.ar',
      admin: false
    });
    failedToken = await request(app)
      .post('/users/sessions')
      .send({
        email: 'existing.user@wolox.com.ar',
        password: 'existingUserPass60'
      })
      .then(response => response.body.token);
    noAdminUserResponse = await request(app)
      .post('/admin/users')
      .set('Authorization', failedToken)
      .send({
        firstName: failureUser.firstName,
        lastName: failureUser.lastName,
        email: failureUser.email,
        password: failureUser.password
      });
    userCreationErrorCode = 'user_creation_error';
    userLoginErrorCode = 'user_login_error';
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
    describe('Creation fails when the there is no user authenticated', () => {
      it('should have status code 401', () => {
        expect(noUserResponse.statusCode).toEqual(401);
      });
      it('should respond with failed authentication error message', () => {
        expect(noUserResponse.body.message).toEqual(adminUserSignUpErrorMessages.unauthorizedErrorMessage);
      });
      it('should respond with login error internal code', () => {
        expect(noUserResponse.body.internal_code).toEqual(userLoginErrorCode);
      });
    });
    describe('Creation fails when the there is no admin user authenticated', () => {
      it('should have status code 401', () => {
        expect(noAdminUserResponse.statusCode).toEqual(401);
      });
      it('should respond with failed authentication error message', () => {
        expect(noAdminUserResponse.body.message).toEqual(
          adminUserSignUpErrorMessages.unauthorizedUserErrorMessage
        );
      });
      it('should respond with login error internal code', () => {
        expect(noAdminUserResponse.body.internal_code).toEqual(userLoginErrorCode);
      });
    });
  });
});
