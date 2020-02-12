module.exports = {
  getUsersBadRequestError: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        example: [
          { limit: "The key 'limit' must be of type 'integer'" },
          { page: "The key 'page' must be of type 'integer'" }
        ]
      },
      internal_code: { type: 'string', example: 'validation_error' }
    }
  },
  signUpUserBadRequestError: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        example: [
          { first_name: "The key 'first_name' it's required, must be of type 'string' and can't be blank" },
          { last_name: "The key 'last_name' it's required, must be of type 'string' and can't be blank" },
          {
            email: "The key 'email' it's required, must be of type 'string' and must belong to wolox domain"
          },
          {
            password:
              "The key 'password' it's required, must be of type 'string', can't be blank, must be at least 8 characters long and must be alphanumeric"
          }
        ]
      },
      internal_code: { type: 'string', example: 'validation_error' }
    }
  },
  signInUserBadRequestError: {
    typr: 'object',
    properties: {
      message: {
        type: 'string',
        example: [
          {
            email: "The key 'email' it's required, must be of type 'string' and must belong to wolox domain"
          },
          {
            password:
              "The key 'password' it's required, must be of type 'string', can't be blank, must be at least 8 characters long and must be alphanumeric"
          }
        ]
      },
      internal_code: { type: 'string', example: 'validation_error' }
    }
  },
  unprocessableEntityError: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        example: 'User for tom.engels@wolox.com.ar already exists!'
      },
      internal_code: {
        type: 'string',
        example: 'user_creation_error'
      }
    }
  },
  unauthorizedError: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        example: 'Authentication failed: Invalid Credentials'
      },
      internal_code: {
        type: 'string',
        example: 'user_login_error'
      }
    }
  }
};
