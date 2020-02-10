const config = require('../../config/index');

const { limit, offset, page } = config.common.pagination;

exports.listUsersMapper = requestQuerie => ({
  limit: requestQuerie.limit || limit,
  page: requestQuerie.page || page,
  offset: requestQuerie.page > 0 ? (requestQuerie.page - 1) * (requestQuerie.limit || limit) : offset
});
