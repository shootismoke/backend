import { NowRequest, NowResponse } from '@now/node';

import { IS_DEV } from '../util';

const whitelist = [
  '198.27.83.222',
  '198.27.81.205',
  '198.27.81.189',
  '198.27.81.189',
  '2607:5300:60:24de::',
  '2607:5300:60:22cd::',
  '2607:5300:60:22bd::',
  '2607:5300:60:4b6e::'
];

/**
 * Whitelist an endpoint to only IP addresses from easycron.com.
 *
 * @see https://www.easycron.com/ips
 */
function whitelisted(req: NowRequest): boolean {
  return whitelist.includes(req.headers['x-forwarded-for'] as string);
}

/**
 * Check that the request comes form a whitelisted IP address.
 */
export function assertWhitelistedIP(
  req: NowRequest,
  res: NowResponse
): boolean {
  const isWhitelisted = IS_DEV || whitelisted(req);
  if (!isWhitelisted) {
    res.status(401);
    res.send({
      status: 'error',
      details: `Not a whitelisted IP address`
    });
    res.end();
  }

  return isWhitelisted;
}
