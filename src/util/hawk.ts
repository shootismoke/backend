import Hawk from '@hapi/hawk';
import Utils from '@hapi/hawk/lib/utils';
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
    console.log('AAA', req.headers, req.method);

    const request = Utils.parseRequest(req, {});

    console.log('BBB', request);

    // Parse HTTP Authorization header

    const attributes = Utils.parseAuthorizationHeader(request.authorization);

    console.log('CCC', attributes);

    // Construct artifacts container

    const artifacts2 = {
      method: request.method,
      host: request.host,
      port: request.port,
      resource: request.url,
      ts: attributes.ts,
      nonce: attributes.nonce,
      hash: attributes.hash,
      ext: attributes.ext,
      app: attributes.app,
      dlg: attributes.dlg,
      mac: attributes.mac,
      id: attributes.id
    };
    console.log('DDD', artifacts2);

    // Authenticate incoming request
    const { artifacts, credentials } = await Hawk.server.authenticate(
      req,
      credentialsFunc
    );

    console.log(artifacts);
    console.log(credentials);

    // Generate Server-Authorization response header
    const header = Hawk.server.header(credentials, artifacts);

    // eslint-disable-next-line require-atomic-updates
    req.headers['Server-Authorization'] = header;

    next();
  } catch (error) {
    // TODO Add Sentry here
    console.log('ERROR!', error.message);
    res.status(401);
    res.send(error.message);
    res.end();
  }
}
