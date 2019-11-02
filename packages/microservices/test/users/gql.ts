import { gql } from '../util';

export const CREATE_USER = gql`
  mutation($input: CreateUserInput!) {
    createUser(input: $input) {
      _id
      expoInstallationId
      expoPushToken
      history {
        rawPm25
        stationId
      }
      notifications
    }
  }
`;

export const UPDATE_USER = gql`
  mutation($userId: ID!, $input: UpdateUserInput!) {
    updateUser(userId: $userId, input: $input) {
      _id
      expoInstallationId
      expoPushToken
      history {
        rawPm25
        stationId
      }
      notifications
    }
  }
`;
