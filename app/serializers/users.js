exports.listUsersSerializer = (users, mappedData) => {
  const { limit, offset, page } = mappedData;
  return {
    page: users.rows,
    count: users.rows.length,
    limit,
    offset,
    total_pages: Math.ceil(users.count / limit),
    total_count: users.count,
    previous_page: page > 1 ? page - 1 : null,
    current_page: page || 1,
    next_page: page * limit < users.count ? page + 1 : null
  };
};
