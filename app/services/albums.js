const rp = require('request-promise');

const util = require('util');

const config = require('../../config/index');
const logger = require('../logger');
const error = require('../errors');
const Album = require('../models').albums;

const { url } = config.common.albums;
const { apiAlbumsError } = error;

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
    throw apiAlbumsError(err.message);
  }
};

exports.createAlbum = async (userId, albumId, title) => {
  try {
    const album = await Album.create({ userId, albumId, title });
    return album;
  } catch (err) {
    logger.error(util.inspect(err));
    throw apiAlbumsError(err.message);
  }
};

exports.findAlbum = async (albumId, userId) => {
  try {
    const album = await Album.findOne({ where: { albumId, userId } });
    return album;
  } catch (err) {
    logger.error(util.inspect(err));
    throw apiAlbumsError(err.message);
  }
};
