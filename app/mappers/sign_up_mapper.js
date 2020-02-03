exports.signUpMapper = requestBody => ({
  firstName: requestBody.first_name,
  lastName: requestBody.last_name,
  email: requestBody.email,
  password: requestBody.password
});

exports.signInMapper = requestBody => ({
  email: requestBody.email,
  password: requestBody.password
});
