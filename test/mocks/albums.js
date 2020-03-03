jest.mock('request-promise');
const rp = require('request-promise');

exports.albumResValueMock = resolvedBody => rp.mockResolvedValue({ body: resolvedBody });

exports.albumRejValueMock = rejectedBody => rp.mockRejectedValue({ body: rejectedBody });
