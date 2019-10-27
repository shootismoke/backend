import { gql } from 'apollo-server-micro';

import { historyTypeDefs } from './history';
import { userTypeDefs } from './user';

const linkSchema = gql`
  scalar Date

  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
`;

export const typeDefs = [linkSchema, historyTypeDefs, userTypeDefs];
