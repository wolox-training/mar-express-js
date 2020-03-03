const rp = require('request-promise');

const util = require('util');

const config = require('../../config/index');
const logger = require('../logger');
const error = require('../errors');
const Album = require('../models').albums;

const { url } = config.common.albums;
const { apiAlbumsError, existingAlbumError } = error;

exports.listAlbums = () =>
  rp({
    uri: `${url}/albums`,
    resolveWithFullResponse: true,
    json: true
  }).catch(err => {
    logger.error(util.inspect(err));
    throw apiAlbumsError(err.message);
  });

exports.listAlbumPhotos = albumId =>
  rp({
    uri: `${url}/photos?albumId=${albumId}`,
    resolveWithFullResponse: true,
    json: true
  }).catch(err => {
    logger.error(util.inspect(err));
    throw apiAlbumsError(err.message);
  });

exports.getAlbumData = async albumId => {
  try {
    const albumDataResponse = await rp({
      uri: `${url}/albums/${albumId}`,
      resolveWithFullResponse: true,
      json: true
    });
    return albumDataResponse.body;
  } catch (err) {
    logger.error(util.inspect(err));
    throw apiAlbumsError('Album not bought: could not find album');
  }
};

exports.findOrCreateAlbum = async (albumData, user) => {
  try {
    const result = await Album.findOrCreate({
      where: { albumId: albumData.id, userId: user.id },
      defaults: { albumId: albumData.id, title: albumData.title, userId: user.id }
    }).spread((album, created) => ({
      album,
      created
    }));
    if (result.created) {
      return result.album;
    }
    throw existingAlbumError(
      `Album not bought: user ${user.firstName} ${user.lastName} already had '${result.album.title}'.`
    );
  } catch (err) {
    logger.error(util.inspect(err));
    throw existingAlbumError(err.message);
  }
};
