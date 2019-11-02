import { gql } from 'apollo-server-micro';

export const stationSchema = gql`
  enum Provider {
    waqi
  }

  type Station {
    _id: ID!
    name: String!
    provider: Provider!
    universalId: ID!
  }
`;
