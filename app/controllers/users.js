const bcrypt = require('bcrypt');
const isAlphanumeric = require('is-alphanumeric');

const util = require('util');

const User = require('../models').users;
const logger = require('../logger');
const error = require('../errors');

const { userCreationError } = error;
const saltRounds = 10;

const validateParams = (email, password) =>
  new Promise((resolve, reject) => {
    if (isAlphanumeric(password) && password.length >= 8 && email.split('@')[1] === 'wolox.com.ar') {
      resolve('Valid Params');
    } else {
      reject(Error('Invalid params!'));
    }
  });

const createUser = req => {
  const { first_name: firstName, last_name: lastName, email, password } = req.body;
  return validateParams(email, password)
    .then(
      bcrypt
        .hash(password, saltRounds)
        .then(hash => {
          User.create({ firstName, lastName, email, password: hash });
          logger.info(`Usuario creado para: ${firstName} ${lastName}`);
        })
        .catch(err => {
          logger.error(util.inspect(err));
          throw userCreationError(err.message);
        })
    )
    .catch(err => {
      logger.error(util.inspect(err));
      throw userCreationError(err.message);
    });
};

exports.postUser = (req, res, next) =>
  createUser(req)
    .then(response => res.status(201).send(response.body))
    .catch(next);
