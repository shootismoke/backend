import { gql } from 'apollo-server-micro';

export const historyItemTypeDefs = gql`
  type HistoryItem {
    _id: ID!
    createdAt: Date!
    rawPm25: Int!
    stationId: String!
  }

  input CreateHistoryItemInput {
    rawPm25: Int!
    stationId: String!
    userId: ID!
  }

  extend type Mutation {
    createHistoryItem(input: CreateHistoryItemInput!): Boolean!
  }
`;
