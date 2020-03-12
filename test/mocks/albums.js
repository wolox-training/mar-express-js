jest.mock('request-promise');
const rp = require('request-promise');

// exports.albumResValueMock = resolvedBody => rp.mockResolvedValueOnce({ body: resolvedBody });
// exports.albumRejValueMock = rejectedBody => rp.mockRejectedValueOnce({ body: rejectedBody });

exports.succeedGetAlbumMock = resolvedBody => rp.mockResolvedValueOnce({ body: resolvedBody });
exports.failedGetAlbumMock = rejectedBody => rp.mockRejectedValueOnce({ body: rejectedBody });
