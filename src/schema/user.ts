import gql from 'graphql-tag';

export const userSchema = gql`
  enum Frequency {
    never
    daily
    weekly
    monthly
  }

  type Notifications {
    expoPushToken: ID!
    frequency: Frequency!
    station: String!
  }

  type User {
    _id: ID!
    expoInstallationId: ID!
    notifications: Notifications
  }

  input NotificationsInput {
    expoPushToken: ID!
    frequency: Frequency!
    station: String!
  }

  input CreateUserInput {
    expoInstallationId: ID!
  }

  input UpdateUserInput {
    notifications: NotificationsInput
  }
`;
