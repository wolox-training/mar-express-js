const { healthCheck } = require('./controllers/healthCheck');
const { getAlbums, getAlbumPhotos } = require('./controllers/albums');
const { postUser } = require('./controllers/users');
const { userSignUpValidation } = require('./middlewares/user_validation');

// const { signUpUser, signInUser } = require('./controllers/users');
// const { userRegistrationRules, userLoginRules, validate } = require('./middlewares/user_validation');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/albums', getAlbums);
  app.get('/albums/:id/photos', getAlbumPhotos);
  app.post('/users', userSignUpValidation, postUser);
  // app.post('/users', [userRegistrationRules(), validate], signUpUser);
  // app.post('/users/sessions', [userLoginRules(), validate], signInUser);
};
