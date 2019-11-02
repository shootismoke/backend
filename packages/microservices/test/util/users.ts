import { User } from '@shootismoke/graphql/src/types';
import { ApolloServerTestClient } from 'apollo-server-testing';
import pMemoize from 'p-memoize';

import { CREATE_USER } from '../users/gql';

function getUser(name: string) {
  return async function(
    client: Promise<ApolloServerTestClient>
  ): Promise<User> {
    const { mutate } = await client;

    const createRes = await mutate({
      mutation: CREATE_USER,
      variables: {
        input: {
          expoInstallationId: `id_${name}`,
          expoPushToken: `token_${name}`
        }
      }
    });

    if (!createRes.data) {
      console.error(createRes);
      throw new Error('No data in response');
    }

    return createRes.data.createUser;
  };
}

export const alice = pMemoize(getUser('alice'));
export const bob = pMemoize(getUser('bob'));
