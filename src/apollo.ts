import { ApolloServer } from 'apollo-server-micro';
import { ServerRegistration } from 'apollo-server-micro/dist/ApolloServer';

import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';
import { connectToDatabase } from './util';
import { NowRequest, NowResponse } from '@now/node';

/**
 * Zeit now function handler, which connects to mongodb and sets up an Apollo
 * server
 */
export function startApollo(
  options?: ServerRegistration
): (req: NowRequest, res: NowResponse) => Promise<void> {
  return async function(req: NowRequest, res: NowResponse): Promise<void> {
    await connectToDatabase();

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true,
      playground: true
    });

    server.createHandler(options)(req, res);
  };
}
