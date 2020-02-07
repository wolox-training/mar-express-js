const util = require('util');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const logger = require('../logger');
const error = require('../errors');
const { signUpMapper, signInMapper } = require('../../app/mappers/sign_up_mapper');
const { hashPassword, findByEmail, createUser } = require('../services/users');

const { userCreationError, userLoginError } = error;

exports.signUpUser = (req, res, next) => {
  const mappedData = signUpMapper(req.body);
  return findByEmail(mappedData.email)
    .then(foundUser => {
      if (foundUser) {
        throw userCreationError(`User for ${mappedData.email} already exists!`);
      } else {
        return hashPassword(mappedData.password).then(hashedPassword =>
          createUser(mappedData.firstName, mappedData.lastName, mappedData.email, hashedPassword)
            .then(user => {
              logger.info(`New user created for: ${mappedData.firstName} ${mappedData.lastName}`);
              res.status(201).send(user);
            })
            .catch(err => {
              logger.error(util.inspect(err));
              throw userCreationError(err.message);
            })
        );
      }
    })
    .catch(next);
};

exports.signInUser = (req, res, next) => {
  const mappedData = signInMapper(req.body);
  return findByEmail(mappedData.email)
    .then(user => {
      if (user) {
        return bcrypt.compare(mappedData.password, user.password).then(result => {
          if (result) {
            const token = jwt.sign(
              { id: user.id, firstName: user.firstName, lastName: user.lastName },
              process.env.TOKEN_SECRET
            );
            res.status(200).send({ token });
          } else {
            throw userLoginError(`Ivalid password for user: ${user.email}`);
          }
        });
      }
      throw userLoginError(`There is no user created for: ${mappedData.email}`);
    })
    .catch(next);
};
