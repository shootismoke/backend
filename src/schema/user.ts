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
  }

  type User {
    _id: ID!
    expoInstallationId: String!
    expoPushToken: String
    history: [HistoryItem]!
    notifications: Notifications!
  }

  input NotificationsInput {
    frequency: Frequency!
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
