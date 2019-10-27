import { gql } from 'apollo-server-micro';

import { userTypeDefs } from './user';

const linkSchema = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
`;

export const typeDefs = [linkSchema, userTypeDefs];
