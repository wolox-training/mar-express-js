const rp = require('request-promise');

const util = require('util');

const config = require('../../config/index');
const logger = require('../logger');
const error = require('../errors');

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
