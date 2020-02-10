const { checkSchema, validationResult } = require('express-validator');

const error = require('../errors');
const { userSignUpSchema, userSignInSchema } = require('../schemas/users');
const { paginatedListSchema } = require('../schemas/pagination');

const { validationError } = error;

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array({ onlyFirstError: true }).map(err => extractedErrors.push({ [err.param]: err.msg }));
  return next(validationError(extractedErrors));
};

exports.userSignUpValidation = [checkSchema(userSignUpSchema), validate];
exports.userSignInValidation = [checkSchema(userSignInSchema), validate];
exports.listValidation = [checkSchema(paginatedListSchema), validate];
