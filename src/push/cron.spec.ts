import { NowRequest } from '@now/node';

import { whitelisted } from './cron';

describe('whitelisted', () => {
  it('should allow a correct ip', () => {
    expect(
      whitelisted(({
        headers: {
          'x-forwarded-for': '198.27.83.222'
        }
      } as unknown) as NowRequest)
    ).toBe(true);
  });

  it('should block an empty', () => {
    expect(
      whitelisted(({
        headers: {}
      } as unknown) as NowRequest)
    ).toBe(false);
  });

  it('should whitelist a correct ip', () => {
    expect(
      whitelisted(({
        headers: {
          'x-forwarded-for': 'foo'
        }
      } as unknown) as NowRequest)
    ).toBe(false);
  });
});
