jest.mock('request-promise');
const rp = require('request-promise');

exports.succeedGetAlbumMock = resolvedBody => rp.mockResolvedValueOnce({ body: resolvedBody });
exports.failedGetAlbumMock = (rejectedBody, statusCode) =>
  rp.mockRejectedValueOnce({ body: rejectedBody, statusCode });
