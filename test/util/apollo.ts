import {
  ApolloServerTestClient,
  createTestClient
} from 'apollo-server-testing';
import mongoose from 'mongoose';

import { createServer } from '../../src/apollo';

export { default as gql } from 'graphql-tag';

export const MONGO_TEST_DB = 'mongodb://localhost/test';

/**
 * Reset DB, and setup fresh Apollo server
 */
export async function reset(testName: string): Promise<ApolloServerTestClient> {
  const uri = `${MONGO_TEST_DB}-${testName}`;
  const server = await createServer({ uri });
  await mongoose.connection.dropDatabase();
  console.log(`Database ${uri} dropped`);

  return createTestClient(server);
}

/**
 * Teardown the db connection
 */
export async function teardown(): Promise<void> {
  await mongoose.connection.close();
}

/**
 * A jest `describe` block, wrapped in an Apollo server
 */
export function describeApollo(
  testName: string,
  fn: (client: Promise<ApolloServerTestClient>) => void
): void {
  const client = reset(testName);

  describe(testName, () => {
    beforeAll(async done => {
      await client;

      done();
    });

    fn(client);

    afterAll(async done => {
      await teardown();

      done();
    });
  });
}
