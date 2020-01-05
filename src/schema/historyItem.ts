import gql from 'graphql-tag';

export const historyItemSchema = gql`
  type HistoryItem {
    _id: ID!
    measurement: Measurement!
    userId: ID!
  }

  input CreateHistoryItemInput {
    measurement: CreateMeasurementInput!
    userId: ID!
  }
`;
