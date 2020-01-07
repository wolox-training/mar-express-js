const { healthCheck } = require('./controllers/healthCheck');
const { getAlbums, getAlbumPhotos } = require('./controllers/albums');
const { postUser } = require('./controllers/users');
const { validateParams } = require('./middlewares/user_validation');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', getAlbums);
  app.get('/albums/:id/photos', getAlbumPhotos);
  app.post('/users', [validateParams], postUser);
};
