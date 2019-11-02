import { gql } from 'apollo-server-micro';

export const stationTypeDefs = gql`
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
