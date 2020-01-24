exports.userSignUpSchema = {
  first_name: {
    in: ['body'],
    exists: true,
    isString: true,
    notEmpty: true,
    trim: true,
    errorMessage: "The key 'first_name' it's required, must be of type 'string' and can't be blank"
  },
  last_name: {
    in: ['body'],
    exists: true,
    isString: true,
    notEmpty: true,
    trim: true,
    errorMessage: "The key 'last_name' it's required, must be of type 'string' and can't be blank"
  },
  email: {
    in: ['body'],
    exists: true,
    isString: true,
    notEmpty: true,
    matches: { options: /@(wolox)\.com\.ar$/i },
    errorMessage: "The key 'email' it's required, must be of type 'string' and must belong to wolox domain"
  },
  password: {
    in: ['body'],
    exists: true,
    isString: true,
    notEmpty: true,
    isLength: { options: { min: 8 } },
    isAlphanumeric: true,
    errorMessage:
      "The key 'password' it's required, must be of type 'string', can't be blank, must be at least 8 characters long and must be alphanumeric"
  }
};
