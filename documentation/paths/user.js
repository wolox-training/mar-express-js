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
        { $ref: '#components/parameters/limitParameter' },
        { $ref: '#components/parameters/pageParameter' }
      ],
      responses: {
        200: { $ref: '#components/responses/getUsers/success' },
        400: { $ref: '#components/responses/getUsers/badRequest' },
        401: { $ref: '#components/responses/getUsers/unauthorized' }
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
        200: { $ref: '#components/responses/signUpUser/success' },
        400: { $ref: '#components/responses/signUpUser/badRequest' },
        422: { $ref: '#components/responses/signUpUser/unprocessableEntity' }
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
        200: { $ref: '#components/responses/signInUser/success' },
        400: { $ref: '#components/responses/signInUser/badRequest' },
        401: { $ref: '#components/responses/signInUser/unauthorized' }
      }
    }
  }
};
