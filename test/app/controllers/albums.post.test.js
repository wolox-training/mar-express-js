const request = require('supertest');
const { factory } = require('factory-girl');
const bcrypt = require('bcrypt');
const nock = require('nock');

const app = require('../../../app');
const config = require('../../../config/index');
const { factoryByModel } = require('../../factory/factory_by_models');
const { albumsErrorMessages } = require('../../errors/albums');

const { saltRounds } = config.common.bcrypt;

nock('https://jsonplaceholder.typicode.com')
  .persist()
  .get('/albums/1')
  .reply(200, {
    userId: 1,
    id: 1,
    title: 'mocked book'
  });

factoryByModel('users');

describe('POST /albums/:id', () => {
  let responseKeys = {};
  let successResponse = {};
  let existingAlbumResponse = {};
  let albumNotFoundResponse = {};
  let adminUser = {};
  let token = {};
  let successAlbumId = {};
  let albumCreationErrorCode = {};
  let albumNotFoundErrorCode = {};
  beforeAll(async () => {
    responseKeys = ['id', 'userId', 'albumId', 'title', 'updatedAt', 'createdAt', 'deleted_at'];
    adminUser = await factory.create('users', {
      firstName: 'Alberto',
      lastName: 'Alvarez',
      password: bcrypt.hash('adminPass60', saltRounds),
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
    successAlbumId = 1;
    successResponse = await request(app)
      .post(`/albums/${successAlbumId}`)
      .set('Authorization', token);
    existingAlbumResponse = await request(app)
      .post(`/albums/${successAlbumId}`)
      .set('Authorization', token);
    albumNotFoundResponse = await request(app)
      .post('/albums/500')
      .set('Authorization', token);
    albumCreationErrorCode = 'album_creation_error';
    albumNotFoundErrorCode = 'api_albums_error';
  });
  describe('Successful case', () => {
    describe('Creates a new album for the authenticated user', () => {
      it('should have status code 201', () => {
        expect(successResponse.statusCode).toEqual(201);
      });
      it('should have the proper keys', () => {
        expect(Object.keys(successResponse.body)).toEqual(responseKeys);
      });
      it('should belong to the user that was authenticated', () => {
        expect(successResponse.body.userId).toEqual(adminUser.id);
      });
    });
  });
  describe('Failure cases', () => {
    describe('Does not create a new album if the user already bought it', () => {
      it('should have status code 500', () => {
        expect(existingAlbumResponse.statusCode).toEqual(500);
      });
      it('should respond with album creation error message', () => {
        expect(existingAlbumResponse.body.message).toEqual(albumsErrorMessages.existingAlbumErrorMessage);
      });
      it('should respond with album creation error internal code', () => {
        expect(existingAlbumResponse.body.internal_code).toEqual(albumCreationErrorCode);
      });
    });
    describe('Does not create a new album if the album does not exist in the external api', () => {
      it('should have status code 404', () => {
        expect(albumNotFoundResponse.statusCode).toEqual(404);
      });
      it('should respond with api album error message', () => {
        expect(albumNotFoundResponse.body.message).toEqual(albumsErrorMessages.albumNotFoundErrorMessage);
      });
      it('should respond with album creation internal code', () => {
        expect(albumNotFoundResponse.body.internal_code).toEqual(albumNotFoundErrorCode);
      });
    });
  });
});
