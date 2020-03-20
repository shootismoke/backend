import Hawk from '@hapi/hawk';
import { ApolloError } from 'apollo-server-micro';
import { Request } from 'express';

import { IS_PROD } from './constants';
import { logger } from './logger';

interface Credentials {
  algorithm: 'sha256';
  key: string;
}

/**
 * Mapping of id->key credentials. Note: for now, this ampping holds both
 * staging and production ids. For example, `shootismoke-default` should never
 * be a valid id for production.
 */
export const CREDENTIALS: Record<string, Credentials> = {
  'shootismoke-default': {
    algorithm: 'sha256',
    key: process.env.HAWK_KEY_1_5_0 as string
  },
  'shootismoke-development': {
    algorithm: 'sha256',
    key: process.env.HAWK_KEY_1_5_0 as string
  },
  'shootismoke-production-v1.5': {
    algorithm: 'sha256',
    key: process.env.HAWK_KEY_1_5_0 as string
  }
};

// Credentials lookup function
function credentialsFunc(id: string): Credentials {
  if (id.startsWith('shootismoke-production-v1.5')) {
    return CREDENTIALS['shootismoke-production-v1.5'];
  }

  if (!CREDENTIALS[id]) {
    const e = new Error(`Invalid Hawk id: ${id}`);
    logger.error(e);
    throw e;
  }

  return {
    algorithm: 'sha256',
    key: CREDENTIALS[id].key
  };
}

/**
 * Successful result from `Hawk.server.authenticate` function.
 */
export interface HawkResult {
  credentials: Credentials;
}

/**
 * A function to test if the request is hawk-authenticated.
 * @see https://hapi.dev/family/hawk
 *
 * @param req - The incoming express request
 */
export async function hawk(req: Request): Promise<HawkResult> {
  try {
    // Authenticate incoming request
    const result = await Hawk.server.authenticate(req, credentialsFunc, {
      // The client constructs the port as 443, because in production we use
      // https. But somehow, in the `req`, object, the port is 80, even in
      // production. Here we just force the port to 443 in production.
      port: IS_PROD ? 443 : undefined
    });

    return result;
  } catch (error) {
    // Add the attributes of the error (e.g. offset in case of stale timestamp)
    // in the GraphQL error extensions
    throw new ApolloError(
      `Hawk: ${error.message}`,
      'UNAUTHENTICATED',
      error.output && error.output.payload && error.output.payload.attributes
    );
  }
}
