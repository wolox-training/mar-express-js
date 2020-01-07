const isAlphanumeric = require('is-alphanumeric');

const util = require('util');

const User = require('../models').users;
const logger = require('../logger');
const error = require('../errors');
const { hashPassword } = require('../services/users');

const { userCreationError } = error;

const validateParams = (email, password) =>
  new Promise((resolve, reject) => {
    if (isAlphanumeric(password) && password.length >= 8 && email.split('@')[1] === 'wolox.com.ar') {
      resolve('Valid Params');
    } else {
      reject(userCreationError('Invalid params!'));
    }
  });

const createUser = (firstName, lastName, email, password) =>
  User.create({ firstName, lastName, email, password });

exports.postUser = (req, res, next) => {
  const { first_name: firstName, last_name: lastName, email, password } = req.body;
  return validateParams(email, password)
    .then(() =>
      hashPassword(password)
        .then(() =>
          createUser(firstName, lastName, email, password)
            .then(user => {
              logger.info(`Usuario creado para: ${firstName} ${lastName}`);
              return user;
            })
            .catch(err => {
              logger.error(util.inspect(err));
              throw userCreationError(err.message);
            })
        )
        .catch(err => {
          logger.error(util.inspect(err));
          throw userCreationError(err.message);
        })
    )
    .then(response => res.status(201).send(response))
    .catch(next);
};
