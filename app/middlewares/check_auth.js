const jwt = require('jsonwebtoken');

const { userLoginError } = require('../errors');

exports.checkAuth = (req, res, next) => {
  try {
    const decoded = jwt.verify(req.headers.authorization, process.env.TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    throw userLoginError('Authentication failed: Invalid Credentials');
  }
};

exports.checkAdminAuth = (req, res, next) => {
  try {
    const decoded = jwt.verify(req.headers.authorization, process.env.TOKEN_SECRET);
    if (decoded.admin) {
      req.user = decoded;
      next();
    } else {
      throw userLoginError('User is not admin');
    }
  } catch (err) {
    if (err.message === 'User is not admin') {
      throw userLoginError(err.message);
    } else {
      throw userLoginError('Authentication failed: Invalid Credentials');
    }
  }
};
