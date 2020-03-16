const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.API_ALBUMS_SERVICE_ERROR = 'api_albums_error';
exports.apiAlbumsServiceError = message => internalError(message, exports.API_ALBUMS_SERVICE_ERROR);

exports.API_ALBUM_NOT_FOUND_ERROR = 'api_album_not_found_error';
exports.apiAlbumNotFoundError = message => internalError(message, exports.API_ALBUM_NOT_FOUND_ERROR);

exports.ALBUM_CREATION_ERROR = 'album_creation_error';
exports.existingAlbumError = message => internalError(message, exports.ALBUM_CREATION_ERROR);

exports.USER_CREATION_ERROR = 'user_creation_error';
exports.userCreationError = message => internalError(message, exports.USER_CREATION_ERROR);

exports.USER_LOGIN_ERROR = 'user_login_error';
exports.userLoginError = message => internalError(message, exports.USER_LOGIN_ERROR);

exports.VALIDATION_ERROR = 'validation_error';
exports.validationError = message => internalError(message, exports.VALIDATION_ERROR);
