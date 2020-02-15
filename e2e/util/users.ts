import { CreateUserInput, User } from '@shootismoke/graphql';
import { ApolloServerTestClient } from 'apollo-server-testing';
import assignDeep from 'assign-deep';
import pMemoize from 'p-memoize';

import { CREATE_USER } from '../graphql/users/gql';

function getUser(name: string) {
  return async function(
    client: Promise<ApolloServerTestClient>,
    additionalInputs: Partial<CreateUserInput> = {}
  ): Promise<User> {
    const { mutate } = await client;

    const input = assignDeep(
      {
        expoInstallationId: `id_${name}`
      },
      additionalInputs
    );
    const createRes = await mutate({
      mutation: CREATE_USER,
      variables: { input }
    });

    if (!createRes.data) {
      throw new Error(`Failed to create user ${name}`);
    }

    return createRes.data.createUser;
  };
}

export const getAlice = pMemoize(getUser('alice'));
export const getBob = pMemoize(getUser('bob'));

export const ALICE_ID = 'id_alice';
export const BOB_ID = 'id_bob';
