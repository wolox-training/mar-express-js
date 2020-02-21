const bcrypt = require('bcrypt');

const config = require('../../config/index');
const User = require('../models').users;
const { listUsersSerializer } = require('../serializers/users');

const { saltRounds } = config.common.bcrypt;

exports.hashPassword = password => bcrypt.hash(password, saltRounds);

exports.findByEmail = value => User.findOne({ where: { email: value } });

exports.createUser = (firstName, lastName, email, password) =>
  User.create({ firstName, lastName, email, password, admin: false });

exports.createAdminUser = (firstName, lastName, email, password) =>
  User.create({ firstName, lastName, email, password, admin: true });

exports.updateToAdmin = user => user.update({ admin: true });

exports.listUsers = mappedData => {
  const { limit, offset } = mappedData;
  return User.findAndCountAll({ limit, offset }).then(users => listUsersSerializer(users, mappedData));
};
