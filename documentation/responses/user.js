module.exports = {
  getUsers: {
    success: {
      description: 'Users were obtained',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/listUsers'
          }
        }
      }
    },
    badRequest: {
      description: 'Bad Request',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/getUsersBadRequestError'
          }
        }
      }
    },
    unauthorized: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/unauthorizedError'
          }
        }
      }
    }
  },
  signUpUser: {
    success: {
      description: 'New user was created',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/signUpUserRes'
          }
        }
      }
    },
    badRequest: {
      description: 'Bad Request',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/signUpUserBadRequestError'
          }
        }
      }
    },
    unprocessableEntity: {
      description: 'User already exist',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/unprocessableEntityError'
          }
        }
      }
    }
  },
  signInUser: {
    success: {
      description: 'Successful login',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/signInUserRes'
          }
        }
      }
    },
    badRequest: {
      description: 'Bad Request',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/signInUserBadRequestError'
          }
        }
      }
    },
    unauthorized: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/unauthorizedError'
          }
        }
      }
    }
  }
};
