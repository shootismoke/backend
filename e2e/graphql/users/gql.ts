import { gql } from '../../util';

export const CREATE_USER = gql`
  mutation($input: CreateUserInput!) {
    createUser(input: $input) {
      _id
      expoInstallationId
    }
  }
`;

export const GET_USER = gql`
  query($expoInstallationId: ID!) {
    getUser(expoInstallationId: $expoInstallationId) {
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
        _id
        expoPushToken
        frequency
        timezone
        universalId
      }
    }
  }
`;
