import {
  ApolloServerTestClient,
  createTestClient
} from 'apollo-server-testing';
import mongoose from 'mongoose';

import { createServer } from '../../src/apollo';

export { default as gql } from 'graphql-tag';

export const MONGO_TEST_DB = 'mongodb://localhost/test';

let cachedClient: ApolloServerTestClient | undefined;

/**
 * Reset DB, and setup fresh Apollo server
 */
export async function reset(): Promise<ApolloServerTestClient> {
  const server = await createServer({
    uri: MONGO_TEST_DB
  });
  await mongoose.connection.dropDatabase();
  console.log(`Database ${MONGO_TEST_DB} dropped`);

  return createTestClient(server);
}

/**
 * Get the Apollo server testing client
 */
export async function client(): Promise<ApolloServerTestClient> {
  if (!cachedClient) {
    cachedClient = await reset();
  }

  return cachedClient;
}

/**
 * Teardown the db connection
 */
export async function teardown(): Promise<void> {
  await mongoose.connection.close();
}
