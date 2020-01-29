const bcrypt = require('bcrypt');

const config = require('../../config/index');
const User = require('../models').users;

const { saltRounds } = config.common.bcrypt;

exports.hashPassword = password => bcrypt.hash(password, saltRounds);

exports.findByEmail = value => User.findOne({ where: { email: value } });

exports.createUser = (firstName, lastName, email, password) =>
  User.create({ firstName, lastName, email, password });
