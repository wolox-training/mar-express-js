const { limitErrorMessage, pageErrorMessage } = require('./error_messages').validationErrorMessages;

exports.paginatedListSchema = {
  limit: {
    in: ['body'],
    optional: true,
    isInt: true,
    toInt: true,
    errorMessage: limitErrorMessage
  },
  page: {
    in: ['body'],
    optional: true,
    isInt: true,
    toInt: true,
    errorMessage: pageErrorMessage
  }
};
