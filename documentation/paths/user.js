module.exports = {
  '/users': {
    get: {
      tags: ['CRUD operations'],
      description: 'Get users',
      security: {
        apiKeyAuth: []
      },
      operationId: 'getUsers',
      parameters: [
        {
          name: 'limit',
          in: 'query',
          schema: {
            type: 'integer',
            default: 3
          },
          required: false
        },
        {
          name: 'page',
          in: 'query',
          schema: {
            type: 'integer',
            default: 1
          },
          required: false
        }
      ],
      responses: {
        200: {
          description: 'Users were obtained',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/listUsers'
              }
            }
          }
        },
        400: {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/getUsersBadRequestError'
              }
            }
          }
        },
        401: {
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
    },
    post: {
      tags: ['CRUD operations'],
      description: 'Create user',
      operationId: 'signUpUser',
      parameters: [],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/signUpUserReq'
            }
          }
        },
        required: true
      },
      responses: {
        200: {
          description: 'New user was created',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/signUpUserRes'
              }
            }
          }
        },
        400: {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/signUpUserBadRequestError'
              }
            }
          }
        },
        422: {
          description: 'User already exist',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/unprocessableEntityError'
              }
            }
          }
        }
      }
    }
  },
  '/users/sessions': {
    post: {
      tags: ['CRUD operations'],
      description: 'Log in user',
      operationId: 'signInUser',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/signInUserReq'
            }
          }
        },
        required: true
      },
      responses: {
        200: {
          description: 'Successful login',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/signInUserRes'
              }
            }
          }
        },
        400: {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/signInUserBadRequestError'
              }
            }
          }
        },
        401: {
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
    }
  }
};
