const jwt = require('jsonwebtoken');

const { userLoginError } = require('../errors');

exports.checkAuth = (req, res, next) => {
  try {
    const decoded = jwt.verify(req.headers.authorization, process.env.TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    throw userLoginError('Authentication failed!');
  }
};
