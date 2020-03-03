jest.mock('bcrypt');
const bcrypt = require('bcrypt');

exports.resHashedPasswordMock = password => bcrypt.hash.mockResolvedValue(password);

exports.resComparePasswordMock = () => bcrypt.compare.mockResolvedValue(true);

exports.rejComparePasswordMock = () => bcrypt.compare.mockRejectedValue(false);
