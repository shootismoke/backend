import { gql } from 'apollo-server-micro';

export const userTypeDefs = gql`
  type User {
    _id: String
    expoInstallationId: String
    expoPushToken: String
  }

  extend type Query {
    user(id: ID!): User
  }

  extend type Mutation {
    getOrCreateUser(expoInstallationId: String!, expoPushToken: String!): User!
  }
`;
