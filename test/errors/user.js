const {
  firstNameErrorMessage,
  lastNameErrorMessage,
  emailErrorMessage,
  passwordErrorMessage
} = require('../../app/schemas/error_messages').validationErrorMessages;

exports.userSignUpErrorsMessages = {
  emptyBodyErrorMessage: [
    { first_name: firstNameErrorMessage },
    { last_name: lastNameErrorMessage },
    { email: emailErrorMessage },
    { email: emailErrorMessage },
    { password: passwordErrorMessage },
    { password: passwordErrorMessage },
    { password: passwordErrorMessage }
  ],
  wrongEmailErrorMessage: [{ email: emailErrorMessage }],
  wrongPasswordErrorMessage: [{ password: passwordErrorMessage }]
};

exports.userSignInErrorsMessages = {
  emptyBodyErrorMessage: [
    { email: emailErrorMessage },
    { email: emailErrorMessage },
    { password: passwordErrorMessage },
    { password: passwordErrorMessage },
    { password: passwordErrorMessage }
  ],
  wrongEmailErrorMessage: [{ email: emailErrorMessage }],
  invalidPasswordErrorMessage: 'Ivalid password for user: fake@wolox.com.ar'
};
