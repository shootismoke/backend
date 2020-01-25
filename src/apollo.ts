import { NowRequest, NowResponse } from '@now/node';
import { ApolloServer } from 'apollo-server-micro';
import { ServerRegistration } from 'apollo-server-micro/dist/ApolloServer';

import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';
import { connectToDatabase } from './util';

interface DbOptions {
  uri?: string;
}

let server: ApolloServer | undefined;
/**
 * Create and return an Apollo server
 *
 * @param options - Options for DB creation
 */
export async function createServer(options?: DbOptions): Promise<ApolloServer> {
  if (server) {
    return server;
  }

  await connectToDatabase(options && options.uri);

  // eslint-disable-next-line require-atomic-updates
  server = new ApolloServer({
    engine: process.env.ENGINE_API_KEY
      ? {
          apiKey: process.env.ENGINE_API_KEY
        }
      : undefined,
    typeDefs,
    resolvers
  });

  return server;
}

interface Options {
  db?: DbOptions;
  server?: ServerRegistration;
}

/**
 * Zeit now function handler, which connects to mongodb and sets up an Apollo
 * server
 */
export function nowApollo(
  options?: Options
): (req: NowRequest, res: NowResponse) => Promise<void> {
  return async function(req: NowRequest, res: NowResponse): Promise<void> {
    const server = await createServer(options && options.db);

    server.createHandler(options && options.server)(req, res);
  };
}
