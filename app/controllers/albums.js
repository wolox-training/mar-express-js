const albumsService = require('../services/albums');

const { listAlbums, listAlbumPhotos } = albumsService;

exports.getAlbums = (req, res, next) =>
  listAlbums()
    .then(response => res.status(200).send(response.body))
    .catch(next);

exports.getAlbumPhotos = (req, res, next) =>
  listAlbumPhotos(req.params.id)
    .then(response => res.status(200).send(response.body))
    .catch(next);
