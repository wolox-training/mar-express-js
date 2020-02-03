const bcrypt = require('bcrypt');

const config = require('../../config/index');
const User = require('../models').users;

const { saltRounds } = config.common.bcrypt;

exports.hashPassword = password => bcrypt.hash(password, saltRounds);

exports.findByEmail = value => User.findOne({ where: { email: value } });

exports.createUser = (firstName, lastName, email, password) =>
  User.create({ firstName, lastName, email, password });

exports.listUsers = (limit, offset, page) =>
  User.findAndCountAll({ limit, offset }).then(users => ({
    page: users.rows,
    count: users.rows.length,
    limit,
    offset,
    total_pages: Math.ceil(users.count / limit),
    total_count: users.count,
    previous_page: page > 1 ? page - 1 : null,
    current_page: page || 1,
    next_page: page * limit < users.count ? page + 1 : null
  }));
