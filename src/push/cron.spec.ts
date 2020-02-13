import { NowRequest, NowResponse } from '@now/node';

import { assertWhitelistedIP } from './cron';

describe('whitelisted', () => {
  it('should allow a correct ip', () => {
    const res = ({
      status: jest.fn(),
      send: jest.fn(),
      end: jest.fn()
    } as unknown) as NowResponse;

    expect(
      assertWhitelistedIP(
        ({
          headers: {
            'x-forwarded-for': '198.27.83.222'
          }
        } as unknown) as NowRequest,
        res
      )
    ).toBe(true);
  });

  it('should block an empty', () => {
    const res = ({
      status: jest.fn(),
      send: jest.fn(),
      end: jest.fn()
    } as unknown) as NowResponse;

    expect(
      assertWhitelistedIP(
        ({
          headers: {}
        } as unknown) as NowRequest,
        res
      )
    ).toBe(false);
  });

  it('should whitelist a correct ip', () => {
    const res = ({
      status: jest.fn(),
      send: jest.fn(),
      end: jest.fn()
    } as unknown) as NowResponse;

    expect(
      assertWhitelistedIP(
        ({
          headers: {
            'x-forwarded-for': 'foo'
          }
        } as unknown) as NowRequest,
        res
      )
    ).toBe(false);
  });
});
