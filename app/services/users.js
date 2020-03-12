const util = require('util');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('../../config/index');
const User = require('../models').users;
const logger = require('../logger');
const error = require('../errors');
const { listUsersSerializer } = require('../serializers/users');

const { saltRounds } = config.common.bcrypt;
const { userCreationError, userLoginError } = error;

const hashPassword = password => bcrypt.hash(password, saltRounds);
const findByEmail = value => User.findOne({ where: { email: value } });
const createUser = (firstName, lastName, email, password) =>
  User.create({ firstName, lastName, email, password, admin: false });
const createAdminUser = (firstName, lastName, email, password) =>
  User.create({ firstName, lastName, email, password, admin: true });
const updateToAdmin = user => user.update({ admin: true });

exports.createNewUser = mappedData => {
  const { firstName, lastName, email, password } = mappedData;
  return findByEmail(email)
    .then(user => {
      if (user) {
        throw userCreationError(`User for ${mappedData.email} already exists!`);
      }
      return hashPassword(password).then(hashedPassword =>
        createUser(firstName, lastName, email, hashedPassword).then(newUser => {
          logger.info(`New user created for: ${firstName} ${lastName}`);
          return newUser;
        })
      );
    })
    .catch(err => {
      logger.error(util.inspect(err));
      throw userCreationError(err.message);
    });
};

exports.createNewAdminUser = mappedData => {
  const { firstName, lastName, email, password } = mappedData;
  return findByEmail(email).then(user => {
    if (user) {
      if (user.admin) {
        throw userCreationError(`Admin user for ${mappedData.email} already exists!`);
      }
      return updateToAdmin(user).then(admin => {
        logger.info(`User ${firstName} ${lastName} updated to admin`);
        return { status: 200, admin };
      });
    }
    return hashPassword(password)
      .then(hashedPassword =>
        createAdminUser(firstName, lastName, email, hashedPassword).then(admin => {
          logger.info(`New admin user created for: ${mappedData.firstName} ${mappedData.lastName}`);
          return { status: 201, admin };
        })
      )
      .catch(err => {
        logger.error(util.inspect(err));
        throw userCreationError(err.message);
      });
  });
};

exports.signInIfUserExists = mappedData => {
  const { email, password } = mappedData;
  return findByEmail(email)
    .then(user => {
      if (user) {
        return bcrypt.compare(password, user.password).then(result => {
          if (result) {
            const token = jwt.sign(
              { id: user.id, firstName: user.firstName, lastName: user.lastName, admin: user.admin },
              process.env.TOKEN_SECRET
            );
            return token;
          }
          throw userLoginError('Authentication failed: Invalid Credentials');
        });
      }
      throw userLoginError('Authentication failed: Invalid Credentials');
    })
    .catch(err => {
      logger.error(util.inspect(err));
      throw userLoginError(err.message);
    });
};

exports.listUsers = mappedData => {
  const { limit, offset } = mappedData;
  return User.findAndCountAll({ limit, offset }).then(users => listUsersSerializer(users, mappedData));
};
