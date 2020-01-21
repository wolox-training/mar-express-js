const { checkSchema, validationResult } = require('express-validator');

const error = require('../errors');
const user_registration_schema = require('../../app/schemas/validation/user_registration_schema');

const { userCreationError } = error;

exports.userValidationRules = () => [checkSchema(user_registration_schema)];

exports.validateUser = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

  return next(userCreationError(extractedErrors));
};
