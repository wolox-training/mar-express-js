const {
  firstNameErrorMessage,
  lastNameErrorMessage,
  emailErrorMessage,
  passwordErrorMessage,
  limitErrorMessage,
  pageErrorMessage
} = require('../../app/schemas/error_messages').validationErrorMessages;

exports.userSignUpErrorsMessages = {
  emptyBodyErrorMessage: [
    { first_name: firstNameErrorMessage },
    { last_name: lastNameErrorMessage },
    { email: emailErrorMessage },
    { password: passwordErrorMessage }
  ],
  invalidEmailErrorMessage: [{ email: emailErrorMessage }],
  invalidPasswordErrorMessage: [{ password: passwordErrorMessage }],
  repeatedEmailErrorMessage: 'User for repeated@wolox.com.ar already exists!'
};

exports.userSignInErrorsMessages = {
  emptyBodyErrorMessage: [{ email: emailErrorMessage }, { password: passwordErrorMessage }],
  invalidEmailErrorMessage: [{ email: emailErrorMessage }],
  invalidPasswordErrorMessage: [{ password: passwordErrorMessage }],
  unauthorizedErrorMessage: 'Authentication failed: Invalid Credentials'
};

exports.usersListErrorMessages = {
  invalidLimitErrorMessage: [{ limit: limitErrorMessage }],
  invalidPageErrorMessage: [{ page: pageErrorMessage }],
  authFailedErrorMessage: 'Authentication failed!'
};
