const { checkSchema, validationResult } = require('express-validator');

const error = require('../errors');
const { userSignUpSchema } = require('../../app/schemas/users');

const { userCreationError } = error;

function validateUser(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
  return next(userCreationError(extractedErrors));
}

exports.userSignUpValidation = [checkSchema(userSignUpSchema), validateUser];
