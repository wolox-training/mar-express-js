exports.userSignUpErrorsMessages = {
  emptyBodyErrorMessage: [
    { first_name: "The key 'first_name' it's required, must be of type 'string' and can't be blank" },
    { last_name: "The key 'last_name' it's required, must be of type 'string' and can't be blank" },
    { email: "The key 'email' it's required, must be of type 'string' and must belong to wolox domain" },
    { email: "The key 'email' it's required, must be of type 'string' and must belong to wolox domain" },
    {
      password:
        "The key 'password' it's required, must be of type 'string', can't be blank, must be at least 8 characters long and must be alphanumeric"
    },
    {
      password:
        "The key 'password' it's required, must be of type 'string', can't be blank, must be at least 8 characters long and must be alphanumeric"
    },
    {
      password:
        "The key 'password' it's required, must be of type 'string', can't be blank, must be at least 8 characters long and must be alphanumeric"
    }
  ],
  wrongEmailErrorMessage: [
    { email: "The key 'email' it's required, must be of type 'string' and must belong to wolox domain" }
  ],
  wrongPasswordErrorMessage: [
    {
      password:
        "The key 'password' it's required, must be of type 'string', can't be blank, must be at least 8 characters long and must be alphanumeric"
    }
  ]
};
