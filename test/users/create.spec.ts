import axios from 'axios';
import http from 'http';
import micro from 'micro';

import userCreate from '../../src/api/users/create';

// eslint-disable-next-line
// @ts-ignore
process.env.MONGODB_ATLAS_URI = global.__MONGO_URI__;

// FIXME Not working
describe.skip('users::create', () => {
  beforeAll(() => {
    // eslint-disable-next-line
    // @ts-ignore
    const server = new http.Server(micro(userCreate));

    server.listen(3000);
  });

  it('should return an error with bad no `expoInstallationId`', () => {
    return expect(
      axios.post('http://localhost:3000/api/users', {})
    ).rejects.toBe('1');
  });
});
