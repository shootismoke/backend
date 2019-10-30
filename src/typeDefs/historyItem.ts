import { gql } from 'apollo-server-micro';

export const historyItemTypeDefs = gql`
  enum Provider {
    aqicn
    waqi
  }

  type HistoryItem {
    _id: ID!
    createdAt: Date!
    provider: Provider!
    rawPm25: Float!
    stationId: String!
  }

  input CreateHistoryItemInput {
    provider: Provider!
    rawPm25: Float!
    stationId: String!
    userId: ID!
  }

  extend type Mutation {
    createHistoryItem(input: CreateHistoryItemInput!): Boolean!
  }
`;
