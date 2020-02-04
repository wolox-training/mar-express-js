const jwt = require('jsonwebtoken');

const { userLoginError } = require('../errors');

exports.checkAuth = (req, res, next) => {
  try {
    jwt.verify(req.headers.authorization, process.env.TOKEN_SECRET);
    next();
  } catch (err) {
    throw userLoginError('Authentication failed!');
  }
};
