const util = require('util');

const User = require('../models').users;
const logger = require('../logger');
const error = require('../errors');
const { hashPassword } = require('../services/users');

const { userCreationError } = error;

exports.postUser = (req, res, next) => {
  const { first_name: firstName, last_name: lastName, email, password } = req.body;
  return hashPassword(password)
    .then(() =>
      User.create({ firstName, lastName, email, password })
        .then(user => {
          logger.info(`Usuario creado para: ${firstName} ${lastName}`);
          return user;
        })
        .catch(err => {
          logger.error(util.inspect(err));
          throw userCreationError(err.message);
        })
    )
    .then(response => res.status(201).send(response))
    .catch(next);
};
