const request = require('supertest');
const { factory } = require('factory-girl');

const { succeedJWTVerifyMock } = require('../../mocks/jwt');
const { resolveHashPasswordMock } = require('../../mocks/bcrypt');
const { succeedGetAlbumMock, failedGetAlbumMock } = require('../../mocks/albums');
const app = require('../../../app');
const { factoryByModel } = require('../../factory/factory_by_models');
const { albumsErrorMessages } = require('../../errors/albums');

factoryByModel('users');

describe('POST /albums/:id', () => {
  let mockedPassword = {};
  let verificationResponse = {};
  let responseKeys = {};
  let successResponse = {};
  let existingAlbumResponse = {};
  let albumNotFoundResponse = {};
  let apiServiceErrorResponse = {};
  let adminUser = {};
  let token = {};
  let successAlbumId = {};
  let albumCreationErrorCode = {};
  let albumNotFoundErrorCode = {};
  let apiAlbumServiceErrorCode = {};
  let successResponseBody = {};
  beforeAll(async () => {
    mockedPassword = await resolveHashPasswordMock('adminPass60');
    responseKeys = ['id', 'albumId', 'title', 'userId', 'updatedAt', 'createdAt', 'deleted_at'];
    adminUser = await factory.create('users', {
      firstName: 'Alberto',
      lastName: 'Alvarez',
      password: mockedPassword,
      email: 'admin@wolox.com.ar',
      admin: true
    });
    token = 'signed-token';
    successAlbumId = 1;
    successResponseBody = await {
      userId: 1,
      id: 1,
      title: 'mocked book'
    };
    verificationResponse = await {
      id: adminUser.id,
      firstName: adminUser.firstName,
      lastName: adminUser.lastName,
      admin: adminUser.admin
    };
    await succeedJWTVerifyMock(verificationResponse);
    await succeedGetAlbumMock(successResponseBody);
    successResponse = await request(app)
      .post(`/albums/${successAlbumId}`)
      .set('Authorization', token);
    await succeedJWTVerifyMock(verificationResponse);
    await succeedGetAlbumMock(successResponseBody);
    existingAlbumResponse = await request(app)
      .post(`/albums/${successAlbumId}`)
      .set('Authorization', token);
    await succeedJWTVerifyMock(verificationResponse);
    await failedGetAlbumMock({}, 404);
    albumNotFoundResponse = await request(app)
      .post('/albums/500')
      .set('Authorization', token);
    await failedGetAlbumMock({}, 503);
    apiServiceErrorResponse = await request(app)
      .post('/albums/10')
      .set('Authorization', token);
    albumCreationErrorCode = 'album_creation_error';
    albumNotFoundErrorCode = 'api_album_not_found_error';
    apiAlbumServiceErrorCode = 'api_albums_error';
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
      it('should have status code 409', () => {
        expect(existingAlbumResponse.statusCode).toEqual(409);
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
      it('should respond with api album not found error message', () => {
        expect(albumNotFoundResponse.body.message).toEqual(albumsErrorMessages.albumNotFoundErrorMessage);
      });
      it('should respond with album creation internal code', () => {
        expect(albumNotFoundResponse.body.internal_code).toEqual(albumNotFoundErrorCode);
      });
    });
    describe('Does not create a new album if the external api service returns an error', () => {
      it('should have status code 503', () => {
        expect(apiServiceErrorResponse.statusCode).toEqual(503);
      });
      it('should respond with api album service error message', () => {
        expect(apiServiceErrorResponse.body.message).toEqual(
          albumsErrorMessages.externalApiServiceErrorMessage
        );
      });
      it('should respond with album creation internal code', () => {
        expect(apiServiceErrorResponse.body.internal_code).toEqual(apiAlbumServiceErrorCode);
      });
    });
  });
});
