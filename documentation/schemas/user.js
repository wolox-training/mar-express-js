module.exports = {
  id: { type: 'integer', example: 7 },
  firstName: { type: 'string', example: 'Thomas' },
  lastName: { type: 'string', example: 'Engels' },
  email: { type: 'string', example: 'tom.engels@wolox.com.ar' },
  password: { type: 'string', example: '$2b$10$53fzhhWQ2XljelB5syb2GuZGFesm0bQLgJ6IA3yMcypbPmfYtCPxW' },
  User: {
    type: 'object',
    properties: {
      id: { $ref: '#/components/schemas/id' },
      firstName: { $ref: '#/components/schemas/firstName' },
      lastName: { $ref: '#/components/schemas/lastName' },
      email: { $ref: '#/components/schemas/email' },
      password: { $ref: '#/components/schemas/password' }
    }
  },
  listUsers: {
    type: 'object',
    properties: {
      page: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/User'
        }
      },
      count: {
        type: 'integer',
        example: 1
      },
      limit: {
        type: 'integer',
        example: 1
      },
      offset: {
        type: 'integer',
        example: 7
      },
      total_pages: {
        type: 'integer',
        example: 10
      },
      total_count: {
        type: 'integer',
        example: 10
      },
      previous_page: {
        type: 'integer',
        example: 6
      },
      current_page: {
        type: 'integer',
        example: 7
      },
      next_page: {
        type: 'integer',
        example: 8
      }
    }
  },
  signUpUserReq: {
    type: 'object',
    properties: {
      firstName: { $ref: '#/components/schemas/firstName' },
      lastName: { $ref: '#/components/schemas/lastName' },
      email: { $ref: '#/components/schemas/email' },
      password: { type: 'string', example: 'passWord58' }
    }
  },
  signUpUserRes: {
    type: 'object',
    properties: {
      id: { $ref: '#/components/schemas/id' },
      firstName: { $ref: '#/components/schemas/firstName' },
      lastName: { $ref: '#/components/schemas/lastName' },
      email: { $ref: '#/components/schemas/email' },
      password: { $ref: '#/components/schemas/password' },
      updatedAt: { type: 'string', example: '2020-02-12T14:29:12.483Z' },
      createdAt: { type: 'string', example: '2020-02-12T14:29:12.483Z' },
      deleted_at: { type: 'string', example: null }
    }
  },
  signInUserReq: {
    type: 'object',
    properties: {
      email: { $ref: '#/components/schemas/email' },
      password: { type: 'string', example: 'passWord58' }
    }
  },
  signInUserRes: {
    type: 'object',
    properties: {
      token: {
        type: 'string',
        example:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoiQWxiZXJ0byIsImxhc3ROYW1lIjoiQWx2YXJleiIsImlhdCI6MTU4MTUxMzU4NX0.RQBXNQWEaj8G-t5Y1DMrT3FgD5g0NCpHobwirIypM8g'
      }
    }
  },
  limitParameter: { type: 'integer', default: 3 },
  pageParameter: { type: 'integer', default: 1 }
};
