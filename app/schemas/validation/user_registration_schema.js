module.exports = {
  first_name: {
    exists: {
      required: true,
      errorMessage: 'firstName must exist'
    },
    isString: {
      required: true,
      errorMessage: 'firstName must be of type string'
    },
    notEmpty: {
      required: true,
      errorMessage: "firstName can't be blank"
    }
  },
  last_name: {
    exists: {
      required: true,
      errorMessage: 'lastName must exist'
    },
    isString: {
      required: true,
      errorMessage: 'lastName must be of type string'
    },
    notEmpty: {
      required: true,
      errorMessage: "lastName can't be blank"
    }
  },
  email: {
    exists: {
      required: true,
      errorMessage: 'email must exist'
    },
    notEmpty: {
      required: true,
      errorMessage: "email can't be empty"
    },
    matches: {
      options: /@(wolox)\.com\.ar$/i,
      errorMessage: 'you may only use email addresses from wolox domain'
    }
  },
  password: {
    exists: {
      required: true,
      errorMessage: 'Password must exist'
    },
    notEmpty: {
      required: true,
      errorMessage: "Password can't be blank"
    },
    isLength: {
      errorMessage: 'Password should be at least 8 characters long',
      options: { min: 8 }
    },
    isAlphanumeric: {
      errorMessage: 'Password should be alphanumeric'
    }
  }
};
