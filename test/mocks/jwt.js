jest.mock('jsonwebtoken');
const jwt = require('jsonwebtoken');

exports.succeedJWTSignMock = signedToken => jwt.sign.mockResolvedValueOnce(signedToken);
exports.succeedJWTVerifyMock = result => jwt.verify.mockReturnValueOnce(result);
exports.failedJWTVerifyMock = message =>
  jwt.verify.mockImplementationOnce(() => {
    throw new Error(message);
  });
