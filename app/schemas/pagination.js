const { limitErrorMessage, pageErrorMessage } = require('./error_messages').validationErrorMessages;

exports.paginatedListSchema = {
  limit: {
    in: ['query'],
    optional: true,
    isInt: true,
    toInt: true,
    errorMessage: limitErrorMessage
  },
  page: {
    in: ['query'],
    optional: true,
    isInt: true,
    toInt: true,
    errorMessage: pageErrorMessage
  }
};
