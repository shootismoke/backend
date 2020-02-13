import { NowRequest } from '@now/node';

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
export function whitelisted(req: NowRequest): boolean {
  return whitelist.includes(req.headers['x-real-ip'] as string);
}
