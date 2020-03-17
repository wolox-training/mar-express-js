const rp = require('request-promise');

const util = require('util');

const config = require('../../config/index');
const logger = require('../logger');
const error = require('../errors');
const Album = require('../models').albums;

const { url } = config.common.albums;
const { apiAlbumsServiceError, apiAlbumNotFoundError, existingAlbumError } = error;

const handleApiError = err => {
  logger.error(util.inspect(err));
  if (err.statusCode === 404) {
    throw apiAlbumNotFoundError('Album not bought: could not find album');
  }
  throw apiAlbumsServiceError('Album not bought: external service error');
};

exports.listAlbums = () =>
  rp({
    uri: `${url}/albums`,
    resolveWithFullResponse: true,
    json: true
  }).catch(err => handleApiError(err));

exports.listAlbumPhotos = albumId =>
  rp({
    uri: `${url}/photos?albumId=${albumId}`,
    resolveWithFullResponse: true,
    json: true
  }).catch(err => handleApiError(err));

exports.getAlbumData = async albumId => {
  try {
    const albumDataResponse = await rp({
      uri: `${url}/albums/${albumId}`,
      resolveWithFullResponse: true,
      json: true
    });
    return albumDataResponse.body;
  } catch (err) {
    return handleApiError(err);
  }
};

exports.findOrCreateAlbum = async (albumData, user) => {
  try {
    const [album, created] = await Album.findOrCreate({
      where: { albumId: albumData.id, userId: user.id },
      defaults: { albumId: albumData.id, title: albumData.title, userId: user.id }
    });
    if (created) {
      return album;
    }
    throw existingAlbumError(
      `Album not bought: user ${user.firstName} ${user.lastName} already had '${album.title}'.`
    );
  } catch (err) {
    logger.error(util.inspect(err));
    throw existingAlbumError(err.message);
  }
};
