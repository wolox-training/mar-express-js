const albumsService = require('../services/albums');
const logger = require('../logger');

const { listAlbums, listAlbumPhotos, getAlbumData, findOrCreateAlbum } = albumsService;

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
      findOrCreateAlbum(albumData, req.user)
        .then(result => {
          logger.info(
            `Album bought: user ${req.user.firstName} ${req.user.lastName} now has '${result.title}'`
          );
          res.status(201).send(result);
        })
        .catch(next)
    )
    .catch(next);
