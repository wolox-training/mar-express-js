const request = require('supertest');
const { factory } = require('factory-girl');
const bcrypt = require('bcrypt');

const app = require('../../../app');
const config = require('../../../config/index');
const { factoryByModel } = require('../../factory/factory_by_models');
const { userSignUpErrorsMessages } = require('../../errors/user');

const { saltRounds } = config.common.bcrypt;

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
    const validationErrorCode = 'validation_error';
    describe('With empty params', () => {
      it("shouldn't create a new user", async () => {
        const failureMessage = userSignUpErrorsMessages.emptyBodyErrorMessage;
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
        expect(res.body.internal_code).toEqual(validationErrorCode);
      });
    });

    describe('With wrong email domain', () => {
      it("shouldn't create a new user", async () => {
        const failureMessage = userSignUpErrorsMessages.wrongEmailErrorMessage;
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
        expect(res.body.internal_code).toEqual(validationErrorCode);
      });
    });

    describe('With non alphanumeric password', () => {
      it("shouldn't create a new user", async () => {
        const failureMessage = userSignUpErrorsMessages.wrongPasswordErrorMessage;
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
        expect(res.body.internal_code).toEqual(validationErrorCode);
      });
    });

    describe('With too short password', () => {
      it("shouldn't create a new user", async () => {
        const failureMessage = userSignUpErrorsMessages.wrongPasswordErrorMessage;
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
        expect(res.body.internal_code).toEqual(validationErrorCode);
      });
    });

    describe('With repeated email address', () => {
      it("shouldn't create a new user", async () => {
        const failureMessage = 'User for repeated@wolox.com.ar already exists!';
        const userCreationErrorCode = 'user_creation_error';
        await factory.create('users', {
          password: bcrypt.hash('passWord58', saltRounds),
          email: 'repeated@wolox.com.ar'
        });
        const user = await factory.build('users').then(dummy => dummy.dataValues);
        user.password = 'passWord58';
        user.email = 'repeated@wolox.com.ar';
        const res = await request(app)
          .post('/users')
          .send({
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            password: user.password
          });
        expect(res.statusCode).toEqual(422);
        expect(res.body.message).toEqual(failureMessage);
        expect(res.body.internal_code).toEqual(userCreationErrorCode);
      });
    });
  });
});

describe('POST /users/sessions', () => {
  describe('Success case', () => {
    describe('With valid params', () => {
      it('Logs in a registered user', async () => {
        await factory.create('users', {
          password: bcrypt.hash('passWord58', saltRounds),
          email: 'fake@wolox.com.ar'
        });
        const res = await request(app)
          .post('/users/sessions')
          .send({
            email: 'fake@wolox.com.ar',
            password: 'passWord58'
          });
        expect(res.statusCode).toEqual(200);
        expect(Object.keys(res.header)).toContain('auth-token');
        expect(res.header['auth-token']).not.toBe(null);
      });
    });
  });

  describe('Failure cases', () => {
    const validationErrorCode = 'validation_error';
    describe('With empty params', () => {
      it('does not log any user', async () => {
        const failureMessage = [
          { email: 'Invalid value' },
          { email: 'you may only use email addresses from wolox domain' },
          { password: 'Password should be at least 8 characters long' },
          { password: 'Password should be alphanumeric' }
        ];
        await factory.create('users', {
          password: bcrypt.hash('passWord58', saltRounds),
          email: 'fake@wolox.com.ar'
        });
        const res = await request(app)
          .post('/users/sessions')
          .send({
            email: '',
            password: ''
          });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual(failureMessage);
        expect(Object.keys(res.header)).not.toContain('auth-token');
        expect(res.body.internal_code).toEqual(validationErrorCode);
      });
    });

    describe('With invalid email', () => {
      it('Does not log any user', async () => {
        const failureMessage = [{ email: 'you may only use email addresses from wolox domain' }];
        await factory.create('users', {
          password: bcrypt.hash('passWord58', saltRounds),
          email: 'fake@wolox.com.ar'
        });
        const res = await request(app)
          .post('/users/sessions')
          .send({
            email: 'fake@gmail.com.ar',
            password: 'passWord58'
          });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual(failureMessage);
        expect(Object.keys(res.header)).not.toContain('auth-token');
        expect(res.body.internal_code).toEqual(validationErrorCode);
      });
    });

    describe('With wrong password', () => {
      const userLoginErrorCode = 'user_login_error';
      it('Does not log any user', async () => {
        const failureMessage = 'Ivalid password for user: fake@wolox.com.ar';
        await factory.create('users', {
          password: bcrypt.hash('passWord58', saltRounds),
          email: 'fake@wolox.com.ar'
        });
        const res = await request(app)
          .post('/users/sessions')
          .send({
            email: 'fake@wolox.com.ar',
            password: 'wrongPassword'
          });
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual(failureMessage);
        expect(Object.keys(res.header)).not.toContain('auth-token');
        expect(res.body.internalCode).toEqual(userLoginErrorCode);
      });
    });
  });
});
