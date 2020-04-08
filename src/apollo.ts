import { NowRequest, NowResponse } from '@now/node';
import { ApolloServer, Config } from 'apollo-server-micro';
import { ServerRegistration } from 'apollo-server-micro/dist/ApolloServer';

import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';
import { ApolloContext, connectToDatabase, CREDENTIALS, hawk } from './util';

interface DbOptions {
  uri?: string;
}

/**
 * Variable that will hold cached Apollo server.
 */
let server: ApolloServer | undefined;

/**
 * Config to pass into Apollo server.
 */
export const apolloServerConfig: Config = {
  context: async (a): Promise<ApolloContext> => {
    if (process.env.NODE_ENV !== 'production') {
      return {
        hawk: {
          credentials: CREDENTIALS['shootismoke-development'],
        },
      };
    }

    try {
      const result = await hawk(a.req);

      return { hawk: result };
    } catch (error) {
      return { hawk: error };
    }
  },
  engine: process.env.ENGINE_API_KEY
    ? {
        apiKey: process.env.ENGINE_API_KEY,
      }
    : undefined,
  resolvers,
  // Disable subscriptions
  // https://www.apollographql.com/docs/graph-manager/operation-registry/#4-disable-subscription-support-on-apollo-server
  subscriptions: false,
  typeDefs,
};
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

  server = new ApolloServer(apolloServerConfig);

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
  return async function (req: NowRequest, res: NowResponse): Promise<void> {
    const server = await createServer(options && options.db);

    server.createHandler(options && options.server)(req, res);
  };
}
