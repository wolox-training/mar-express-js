const { healthCheck } = require('./controllers/healthCheck');
const { getAlbums, getAlbumPhotos } = require('./controllers/albums');
const { signUpUser, signInUser, getUsers } = require('./controllers/users');
const { checkAuth } = require('./middlewares/check_auth');
const {
  userSignUpValidation,
  userSignInValidation,
  listValidation
} = require('./middlewares/schema_validation');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', getAlbums);
  app.get('/albums/:id/photos', getAlbumPhotos);
  app.post('/users', userSignUpValidation, signUpUser);
  app.post('/users/sessions', userSignInValidation, signInUser);
  app.get('/users', checkAuth, listValidation, getUsers);
};
