import { gql } from 'apollo-server-micro';

export const historyTypeDefs = gql`
  input HistoryInput {
    rawPm25: Int
    stationId: String
  }

  type History {
    _id: String
    createdAt: Date
    rawPm25: Int
    stationId: String
  }

  extend type Mutation {
    addHistory(userId: String!, aqi: Int!, stationId: String!): Boolean!
  }
`;
