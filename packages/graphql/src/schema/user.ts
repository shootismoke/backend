import gql from 'graphql-tag';

export const userSchema = gql`
  enum Notifications {
    never
    daily
    weekly
    monthly
  }

  type User {
    _id: ID!
    expoInstallationId: String!
    expoPushToken: String
    history: [HistoryItem]!
    notifications: Notifications!
  }

  input CreateUserInput {
    expoInstallationId: String!
    expoPushToken: String
    notifications: Notifications
  }

  input UpdateUserInput {
    expoInstallationId: String
    expoPushToken: String
    notifications: Notifications
  }
`;
