import { NextFunction, Request, Response } from 'express';

import { IS_DEV } from '../util';

/**
 * Whitelist an endpoint to only IP addresses from easycron.com.
 *
 * @see https://www.easycron.com/ips
 */
const whitelist = [
  '198.27.83.222',
  '198.27.81.205',
  '198.27.81.189',
  '192.99.36.110',
  '2607:5300:60:24de::',
  '2607:5300:60:22cd::',
  '2607:5300:60:22bd::',
  '2607:5300:60:4b6e::',
];

/**
 * Check that the request comes form a whitelisted IP address.
 */
export function isWhitelisted(ip: string): boolean {
  return IS_DEV || whitelist.includes(ip);
}

/**
 * Express-like middleware that whitelists the IP address.
 */
export function whitelistIPMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const ip = req.headers['x-forwarded-for'] as string;

  if (!isWhitelisted(ip)) {
    res.status(403);
    res.send({
      status: 'error',
      details: `IP address not whitelisted: ${ip}`,
    });
    res.end();
  } else {
    next();
  }
}
