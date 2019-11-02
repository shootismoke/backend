import gql from 'graphql-tag';

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
