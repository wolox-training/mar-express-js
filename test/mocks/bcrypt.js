jest.mock('bcrypt');
const bcrypt = require('bcrypt');

// exports.resHashedPasswordMock = password => bcrypt.hash.mockResolvedValue(password);
// exports.resComparePasswordMock = result => bcrypt.compare.mockResolvedValue(result);

exports.resolveHashPasswordMock = password => bcrypt.hash.mockResolvedValue(password);
exports.resolveComparePasswordMock = result => bcrypt.compare.mockResolvedValue(result);
