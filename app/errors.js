const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.API_ALBUMS_ERROR = 'api_albums_error';
exports.apiAlbumsError = message => internalError(message, exports.API_ALBUMS_ERROR);

exports.USER_CREATION_ERROR = 'user_creation_error';
exports.userCreationError = message => internalError(message, exports.USER_CREATION_ERROR);
