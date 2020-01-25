import Hawk from '@hapi/hawk';
import { NextFunction, Request, Response } from 'express';

interface Credential {
  algorithm: 'sha256';
  key: string;
}

const CREDENTIALS: Record<string, Credential> = {
  'shootismoke-development': {
    algorithm: 'sha256',
    key: process.env.HAWK_KEY_1_5_0 as string
  },
  'shootismoke-production-v1.5.0': {
    algorithm: 'sha256',
    key: process.env.HAWK_KEY_1_5_0 as string
  }
};

// Credentials lookup function
function credentialsFunc(id: string): Credential {
  console.log('credentialsFunc', id, CREDENTIALS[id].key);
  if (!CREDENTIALS[id]) {
    throw new Error(`Invalid Hawk id: ${id}`);
  }

  return {
    algorithm: 'sha256',
    key: CREDENTIALS[id].key
  };
}

/**
 * An express middleware to secure an endpoint with Hawk
 * @see https://hapi.dev/family/hawk
 *
 * @param req - The incoming express request
 * @param res - The outgoing express response
 * @param next - The express next function
 */
export async function hawk(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Authenticate incoming request
    const { artifacts, credentials } = await Hawk.server.authenticate(
      req,
      credentialsFunc,
      {
        // The client constructs the port as 443, because in production we use
        // https. But somehow, in the `req`, object, the port is 80, even in
        // production. Here we just force the port to 443 in production.
        port: process.env.NODE_ENV === 'production' ? 443 : undefined
      }
    );

    // Generate Server-Authorization response header
    const header = Hawk.server.header(credentials, artifacts);

    // eslint-disable-next-line require-atomic-updates
    req.headers['Server-Authorization'] = header;

    next();
  } catch (error) {
    // TODO Add Sentry here
    res.status(401);
    res.send(error.message);
    res.end();
  }
}
