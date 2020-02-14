import { gql } from '../../util';

export const CREATE_USER = gql`
  mutation($input: CreateUserInput!) {
    createUser(input: $input) {
      _id
      expoInstallationId
    }
  }
`;

export const UPDATE_USER = gql`
  mutation($expoInstallationId: ID!, $input: UpdateUserInput!) {
    updateUser(expoInstallationId: $expoInstallationId, input: $input) {
      _id
      expoInstallationId
      notifications {
        expoPushToken
        frequency
        timezone
        universalId
      }
    }
  }
`;
