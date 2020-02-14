module.exports = {
  limitParameter: {
    name: 'limit',
    in: 'query',
    schema: { type: 'integer', default: 3 },
    required: false
  },
  pageParameter: {
    name: 'page',
    in: 'query',
    schema: { type: 'integer', default: 1 },
    required: false
  }
};
