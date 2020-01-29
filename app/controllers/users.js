const util = require('util');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const logger = require('../logger');
const error = require('../errors');
const { hashPassword, findByEmail, createUser } = require('../services/users');

const { userCreationError, userLoginError } = error;

exports.signUpUser = (req, res, next) => {
  const { first_name: firstName, last_name: lastName, email, password } = req.body;
  return findByEmail(email)
    .then(foundUser => {
      if (foundUser) {
        throw userCreationError(`User for ${email} already exists!`);
      } else {
        return hashPassword(password)
          .then(hashedPassword =>
            createUser(firstName, lastName, email, hashedPassword)
              .then(user => {
                logger.info(`New user created for: ${firstName} ${lastName}`);
                res.status(201).send(user);
              })
              .catch(err => {
                logger.error(util.inspect(err));
                throw userCreationError(err.message);
              })
          )
          .then(response => res.status(201).send(response))
          .catch(next);
      }
    })
    .catch(next);
};

exports.signInUser = (req, res, next) =>
  findByEmail(req.body.email)
    .then(user =>
      bcrypt
        .compare(req.body.password, user.password)
        .then(result => {
          if (result) {
            const token = jwt.sign(
              { id: user.id, firstName: user.firstName, lastName: user.lastName },
              process.env.TOKEN_SECRET
            );
            res.status(200).send(token);
          } else {
            res.status(401).send(userLoginError(`Ivalid password for user: ${user.email}`));
          }
        })
        .catch(err => {
          logger.error(util.inspect(err));
          throw userLoginError(err.message);
        })
    )
    .catch(next);
