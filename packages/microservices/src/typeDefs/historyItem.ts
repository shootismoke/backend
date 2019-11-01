import { gql } from 'apollo-server-micro';

export const historyItemTypeDefs = gql`
  type HistoryItem {
    _id: ID!
    createdAt: Date!
    rawPm25: Float!
    stationId: ID!
  }

  input CreateHistoryItemInput {
    providerId: ID!
    rawPm25: Float!
    userId: ID!
  }

  extend type Mutation {
    createHistoryItem(input: CreateHistoryItemInput!): Boolean!
  }
`;
