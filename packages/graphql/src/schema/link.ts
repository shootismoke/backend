import { gql } from 'apollo-server-micro';

export const linkSchema = gql`
  scalar Date

  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
`;
