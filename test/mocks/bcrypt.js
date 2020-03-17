jest.mock('bcrypt');
const bcrypt = require('bcrypt');

exports.resolveHashPasswordMock = password => bcrypt.hash.mockResolvedValue(password);
exports.resolveComparePasswordMock = result => bcrypt.compare.mockResolvedValue(result);
