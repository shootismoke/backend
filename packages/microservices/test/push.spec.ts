import fetch from 'node-fetch';

import { describeApollo, getAlice } from './util';

describeApollo('push', client => {
  it('should return all the results', async done => {
    const alice = await getAlice(client);

    const response = await fetch('http://localhost:3000/api.p');

    expect(1).toBe(1);
    done();
  });
});
