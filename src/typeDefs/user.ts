import { gql } from 'apollo-server-micro';

export const userTypeDefs = gql`
  enum Notifications {
    never
    daily
    weekly
    monthly
  }

  type User {
    _id: ID!
    expoInstallationId: String!
    expoPushToken: String!
    history: [HistoryItem]!
    notifications: Notifications!
  }

  input CreateUserInput {
    expoInstallationId: String!
    expoPushToken: String!
    notifications: Notifications
  }

  input UpdateUserInput {
    expoInstallationId: String
    expoPushToken: String
    notifications: Notifications
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: String!, input: UpdateUserInput!): User!
  }
`;
