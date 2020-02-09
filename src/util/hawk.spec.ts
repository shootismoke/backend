import Hawk from '@hapi/hawk';
import { Request } from 'express';

import { hawk } from './hawk';

function createReq(id: string, key: string): Request {
  const { header } = Hawk.client.header(
    'http://example.com/resource/4?filter=a',
    'GET',
    {
      timestamp: Math.round(new Date().getTime() / 1000),
      nonce: 'Ygvqdz',
      credentials: {
        algorithm: 'sha256',
        id,
        key
      }
    }
  );

  return ({
    headers: {
      host: 'example.com',
      authorization: header
    },
    method: 'GET',
    nonce: 'Ygvqdz',
    port: 80,
    url: '/resource/4?filter=a'
  } as unknown) as Request;
}

describe('hawk', () => {
  it('should throw an error on invalid id', async done => {
    const req = createReq('foo', 'bar');

    const result = await hawk(req);

    expect(result).toBe('Invalid Hawk id: foo');

    done();
  });

  it('should return "Unauthorized" on a plain request', async done => {
    const req = createReq('foo', 'bar');
    delete req.headers.authorization;

    const result = await hawk(req);

    expect(result).toBe('Unauthorized');

    done();
  });

  it('should work', async done => {
    const req = createReq(
      'shootismoke-development',
      process.env.HAWK_KEY_1_5_0 as string
    );

    const result = await hawk(req);

    expect(result).toBe(true);

    done();
  });
});
