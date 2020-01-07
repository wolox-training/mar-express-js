const isAlphanumeric = require('is-alphanumeric');

const error = require('../errors');

const { userCreationError } = error;

exports.validateParams = (req, res, next) => {
  const { email, password } = req.body;
  if (isAlphanumeric(password) && password.length >= 8 && email.split('@')[1] === 'wolox.com.ar') {
    next();
  } else {
    next(userCreationError('Invalid params!'));
  }
};
