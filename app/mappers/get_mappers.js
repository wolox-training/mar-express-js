exports.listUsersMapper = requestBody => ({
  limit: requestBody.limit || 3,
  page: requestBody.page || 1,
  offset: requestBody.page > 0 ? (requestBody.page - 1) * (requestBody.limit || 3) : 0
});
