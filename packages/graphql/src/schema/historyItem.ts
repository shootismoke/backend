import gql from 'graphql-tag';

export const historyItemSchema = gql`
  type HistoryItem {
    _id: ID!
    createdAt: Date!
    rawPm25: Float!
    stationId: ID!
  }

  input CreateHistoryItemInput {
    rawPm25: Float!
    universalId: ID!
    userId: ID!
  }
`;
