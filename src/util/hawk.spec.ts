import Hawk from '@hapi/hawk';
import { Request, Response } from 'express';

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

    const res = ({
      end: jest.fn(),
      writeHead: jest.fn()
    } as unknown) as Response;

    await hawk(req, res, () => {
      /* Do nothing */
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(res.writeHead).toBeCalledWith(401, 'Invalid Hawk id: foo');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(res.end).toHaveBeenCalledTimes(1);

    done();
  });

  it('should work', async done => {
    const req = createReq(
      'shootismoke-v1.5.0',
      process.env.HAWK_KEY_1_5_0 as string
    );

    const res = ({
      end: () => {
        /* Do nothing */
      },
      writeHead: () => {
        /* Do nothing */
      }
    } as unknown) as Response;

    const next = jest.fn();
    await hawk(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);

    done();
  });
});
