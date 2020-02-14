const user = require('./user');
const errors = require('./error');

module.exports = {
  ...user,
  ...errors
};
