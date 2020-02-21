module.exports = {
  limitParameter: {
    name: 'limit',
    in: 'query',
    schema: { $ref: '#components/schemas/limitParameter' },
    required: false
  },
  pageParameter: {
    name: 'page',
    in: 'query',
    schema: { $ref: '#components/schemas/pageParameter' },
    required: false
  }
};
