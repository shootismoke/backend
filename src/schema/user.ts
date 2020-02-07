import gql from 'graphql-tag';

export const userSchema = gql`
  enum Frequency {
    never
    daily
    weekly
    monthly
  }

  type Notifications {
    frequency: Frequency!
    station: String
  }

  type User {
    _id: ID!
    expoInstallationId: String!
    expoPushToken: String
    notifications: Notifications!
  }

  input NotificationsInput {
    frequency: Frequency!
    station: String
  }

  input CreateUserInput {
    expoInstallationId: String!
    expoPushToken: String
    notifications: NotificationsInput
  }

  input UpdateUserInput {
    expoInstallationId: String
    expoPushToken: String
    notifications: NotificationsInput
  }
`;
