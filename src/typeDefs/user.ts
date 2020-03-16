import { gql } from 'apollo-server-micro';

export const userTypeDefs = gql`
  extend type Query {
    getUser(expoInstallationId: ID!): User
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(expoInstallationId: ID!, input: UpdateUserInput!): User!
  }
`;
