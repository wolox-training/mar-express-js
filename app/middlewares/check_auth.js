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

exports.checkAdminAuth = (req, res, next) => {
  let decoded = {};
  try {
    decoded = jwt.verify(req.headers.authorization, process.env.TOKEN_SECRET);
    if (decoded.admin) {
      next();
    } else {
      throw userLoginError('User is not admin');
    }
  } catch (err) {
    if (err.message === 'invalid signature') {
      throw userLoginError('Authentication failed!');
    } else {
      throw userLoginError(err.message);
    }
  }
};
