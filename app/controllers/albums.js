const util = require('util');

const albumsService = require('../services/albums');
const logger = require('../logger');
const error = require('../errors');

const { apiAlbumsError, existingAlbumError } = error;

const { listAlbums, listAlbumPhotos, getAlbumData, createAlbum, findAlbum } = albumsService;

exports.getAlbums = (req, res, next) =>
  listAlbums()
    .then(response => res.status(200).send(response.body))
    .catch(next);

exports.getAlbumPhotos = (req, res, next) =>
  listAlbumPhotos(req.params.id)
    .then(response => res.status(200).send(response.body))
    .catch(next);

exports.buyAlbum = (req, res, next) =>
  getAlbumData(req.params.id)
    .then(albumData =>
      findAlbum(albumData.id, req.user.id).then(existingAlbum => {
        if (existingAlbum) {
          throw existingAlbumError(
            `Album not bought: user ${req.user.firstName} ${req.user.lastName} already had '${albumData.title}'.`
          );
        } else {
          return createAlbum(req.user.id, albumData.id, albumData.title)
            .then(album => {
              logger.info(
                `Album bought: user ${req.user.firstName} ${req.user.lastName} now has '${albumData.title}'`
              );
              res.status(201).send(album);
            })
            .catch(next);
        }
      })
    )
    .catch(err => {
      logger.error(util.inspect(err));
      if (err.internalCode === 'api_albums_error') {
        throw apiAlbumsError('Album not bought: could not find album');
      }
      throw existingAlbumError(err.message);
    })
    .catch(next);
