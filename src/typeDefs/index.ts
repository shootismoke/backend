import { gql } from 'apollo-server-micro';

import { userTypeDefs } from './user';

const linkSchema = gql`
  type Query {
  }

  type Mutation {
  }
`;

export const typeDefs = [linkSchema, userTypeDefs];
