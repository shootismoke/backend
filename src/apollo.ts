import { ApolloServer } from 'apollo-server-micro';
import { ServerRegistration } from 'apollo-server-micro/dist/ApolloServer';

import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';
import { connectToDatabase } from './util';
import { NowRequest, NowResponse } from '@now/node';

interface DbOptions {
  uri?: string;
}

let server: ApolloServer | undefined;
export async function createServer(options?: DbOptions): Promise<ApolloServer> {
  if (server) {
    return server;
  }

  if (options && options.uri) {
    await connectToDatabase(options.uri);
  } else {
    if (!process.env.MONGODB_ATLAS_URI) {
      throw new Error('process.env.MONGODB_ATLAS_URI is not defined');
    }
    await connectToDatabase(process.env.MONGODB_ATLAS_URI);
  }

  server = new ApolloServer({
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
    const server = await createServer();

    server.createHandler(options && options.server)(req, res);
  };
}
