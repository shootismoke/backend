import Hawk from '@hapi/hawk';
import { Request, Response } from 'express';

import { hawk } from './hawk';

function noop(): void {
  /* Do nothing */
}

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

function createRes(): Response {
  return ({
    end: jest.fn(),
    send: jest.fn(),
    status: jest.fn()
  } as unknown) as Response;
}

describe('hawk', () => {
  it('should throw an error on invalid id', async done => {
    const req = createReq('foo', 'bar');
    const res = createRes();

    await hawk(req, res, noop);

    expect(res.send).toBeCalledWith('Invalid Hawk id: foo'); // eslint-disable-line @typescript-eslint/unbound-method
    expect(res.status).toBeCalledWith(401); // eslint-disable-line @typescript-eslint/unbound-method
    expect(res.end).toHaveBeenCalledTimes(1); // eslint-disable-line @typescript-eslint/unbound-method

    done();
  });

  it('should return "Unauthorized" on a plain request', async done => {
    const req = createReq('foo', 'bar');
    delete req.headers.authorization;
    const res = createRes();

    await hawk(req, res, noop);

    expect(res.send).toBeCalledWith('Unauthorized'); // eslint-disable-line @typescript-eslint/unbound-method
    expect(res.status).toBeCalledWith(401); // eslint-disable-line @typescript-eslint/unbound-method
    expect(res.end).toHaveBeenCalledTimes(1); // eslint-disable-line @typescript-eslint/unbound-method

    done();
  });

  it('should work', async done => {
    const req = createReq(
      'shootismoke-v1.5.0',
      process.env.HAWK_KEY_1_5_0 as string
    );
    const res = createRes();

    const next = jest.fn();
    await hawk(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);

    done();
  });
});
