const {
  firstNameErrorMessage,
  lastNameErrorMessage,
  emailErrorMessage,
  passwordErrorMessage
} = require('./error_messages').validationErrorMessages;

exports.userSignUpSchema = {
  first_name: {
    in: ['body'],
    exists: true,
    isString: true,
    notEmpty: true,
    trim: true,
    errorMessage: firstNameErrorMessage
  },
  last_name: {
    in: ['body'],
    exists: true,
    isString: true,
    notEmpty: true,
    trim: true,
    errorMessage: lastNameErrorMessage
  },
  email: {
    in: ['body'],
    exists: true,
    isString: true,
    notEmpty: true,
    matches: { options: /@(wolox)\.com\.ar$/i },
    errorMessage: emailErrorMessage
  },
  password: {
    in: ['body'],
    exists: true,
    isString: true,
    notEmpty: true,
    isLength: { options: { min: 8 } },
    isAlphanumeric: true,
    errorMessage: passwordErrorMessage
  }
};

exports.userSignInSchema = {
  email: {
    in: ['body'],
    exists: true,
    isString: true,
    notEmpty: true,
    matches: { options: /@(wolox)\.com\.ar$/i },
    errorMessage: emailErrorMessage
  },
  password: {
    in: ['body'],
    exists: true,
    isString: true,
    notEmpty: true,
    isLength: { options: { min: 8 } },
    isAlphanumeric: true,
    errorMessage: passwordErrorMessage
  }
};
