const util = require('util');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const logger = require('../logger');
const error = require('../errors');
const { signUpMapper, signInMapper } = require('../mappers/post_mappers');
const { listUsersMapper } = require('../mappers/get_mappers');
const {
  hashPassword,
  findByEmail,
  createUser,
  createAdminUser,
  updateToAdmin,
  listUsers
} = require('../services/users');

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

exports.signUpAdminUser = (req, res, next) => {
  const mappedData = signUpMapper(req.body);
  return findByEmail(mappedData.email)
    .then(foundUser => {
      if (foundUser) {
        if (foundUser.admin) {
          throw userCreationError(`Admin user for ${mappedData.email} already exists!`);
        } else {
          return updateToAdmin(foundUser).then(admin => {
            logger.info(`User ${mappedData.firstName} ${mappedData.lastName} updated to admin`);
            res.status(200).send(admin);
          });
        }
      } else {
        return hashPassword(mappedData.password).then(hashedPassword =>
          createAdminUser(mappedData.firstName, mappedData.lastName, mappedData.email, hashedPassword)
            .then(admin => {
              logger.info(`New admin user created for: ${mappedData.firstName} ${mappedData.lastName}`);
              res.status(201).send(admin);
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
        return bcrypt
          .compare(mappedData.password, user.password)
          .then(result => {
            if (result) {
              const token = jwt.sign(
                { id: user.id, firstName: user.firstName, lastName: user.lastName, admin: user.admin },
                process.env.TOKEN_SECRET
              );
              res.status(200).send({ token });
            } else {
              throw userLoginError('Authentication failed: Invalid Credentials');
            }
          })
          .catch(err => {
            logger.error(util.inspect(err));
            throw userLoginError('Authentication failed: Invalid Credentials');
          });
      }
      throw userLoginError('Authentication failed: Invalid Credentials');
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  const mappedData = listUsersMapper(req.query);
  return listUsers(mappedData)
    .then(users => res.status(200).send(users))
    .catch(next);
};
