const bcrypt = require('bcrypt');

const config = require('../../config/index');

const { saltRounds } = config.common.bcrypt;

exports.hashPassword = password => bcrypt.hash(password, saltRounds);
