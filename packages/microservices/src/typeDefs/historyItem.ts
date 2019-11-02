import { gql } from 'apollo-server-micro';

export const historyItemTypeDefs = gql`
  extend type Mutation {
    createHistoryItem(input: CreateHistoryItemInput!): Boolean!
  }
`;
