const { signUpMapper, signInMapper } = require('../mappers/post_mappers');
const { listUsersMapper } = require('../mappers/get_mappers');
const { createNewUser, listUsers, signInIfUserExists } = require('../services/users');

exports.signUpUser = (req, res, next) => {
  const mappedData = signUpMapper(req.body);
  return createNewUser(mappedData, false)
    .then(user => res.status(201).send(user))
    .catch(next);
};

exports.signUpAdminUser = (req, res, next) => {
  const mappedData = signUpMapper(req.body);
  return createNewUser(mappedData, true)
    .then(response => res.status(response.status).send(response.adminUser))
    .catch(next);
};

exports.signInUser = (req, res, next) => {
  const mappedData = signInMapper(req.body);
  return signInIfUserExists(mappedData)
    .then(token => res.status(200).send({ token }))
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  const mappedData = listUsersMapper(req.query);
  return listUsers(mappedData)
    .then(users => res.status(200).send(users))
    .catch(next);
};
