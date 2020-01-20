const { checkSchema, validationResult } = require('express-validator');

const error = require('../errors');
const { userSignUpSchema } = require('../../app/schemas/users');

// const { validationError } = error;
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
// exports.userRegistrationRules = () => [
//   checkSchema({
//     first_name: {
//       notEmpty: true,
//       errorMessage: "firstName can't be blank"
//     },
//     last_name: {
//       notEmpty: true,
//       errorMessage: "lastName can't be blank"
//     },
//     email: {
//       notEmpty: true,
//       matches: {
//         options: /@(wolox)\.com\.ar$/i,
//         errorMessage: 'you may only use email addresses from wolox domain'
//       }
//     },
//     password: {
//       isLength: {
//         errorMessage: 'Password should be at least 8 characters long',
//         options: { min: 8 }
//       },
//       isAlphanumeric: {
//         errorMessage: 'Password should be alphanumeric'
//       }
//     }
//   })
// ];

// exports.userLoginRules = () => [
//   checkSchema({
//     email: {
//       notEmpty: true,
//       matches: {
//         options: /@(wolox)\.com\.ar$/i,
//         errorMessage: 'you may only use email addresses from wolox domain'
//       }
//     },
//     password: {
//       isLength: {
//         errorMessage: 'Password should be at least 8 characters long',
//         options: { min: 8 }
//       },
//       isAlphanumeric: {
//         errorMessage: 'Password should be alphanumeric'
//       }
//     }
//   })
// ];

// exports.validate = (req, res, next) => {

exports.userSignUpValidation = [checkSchema(userSignUpSchema), validateUser];

//   return next(validationError(extractedErrors));
// };
