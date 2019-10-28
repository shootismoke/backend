import { gql } from 'apollo-server-micro';

export const userTypeDefs = gql`
  enum Notifications {
    never
    daily
    weekly
    monthly
  }

  type User {
    _id: String!
    expoInstallationId: String!
    expoPushToken: String!
    history: [History]!
    notifications: Notifications!
  }

  extend type Query {
    user(id: ID!): User
  }

  input CreateUserInput {
    expoInstallationId: String!
    expoPushToken: String!
    notifications: Notifications
    history: [HistoryInput]
  }

  input UpdateUserInput {
    expoPushToken: String
    notifications: Notifications
    history: [HistoryInput]
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(expoInstallationId: String!, input: UpdateUserInput!): User!
  }
`;
