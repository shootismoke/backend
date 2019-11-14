import { CreateUserInput, User } from '@shootismoke/graphql';
import { ApolloServerTestClient } from 'apollo-server-testing';
import deepmerge from 'deepmerge';
import pMemoize from 'p-memoize';

import { CREATE_USER } from '../users/gql';

function getUser(name: string) {
  return async function(
    client: Promise<ApolloServerTestClient>,
    additionalInputs: Partial<CreateUserInput> = {}
  ): Promise<User> {
    const { mutate } = await client;

    const input = deepmerge(
      {
        expoInstallationId: `id_${name}`,
        expoPushToken: `token_${name}`
      },
      additionalInputs
    );
    const createRes = await mutate({
      mutation: CREATE_USER,
      variables: { input }
    });

    if (!createRes.data) {
      console.error(createRes);
      throw new Error('No data in response');
    }

    return createRes.data.createUser;
  };
}

export const getAlice = pMemoize(getUser('alice'));
export const getBob = pMemoize(getUser('bob'));
