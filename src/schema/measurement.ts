import { AllPollutants } from '@shootismoke/convert';
import gql from 'graphql-tag';

export const measurementSchema = gql`
  type Attribution {
    name: String!
    url: String
  }

  input AttributionInput {
    name: String!
    url: String
  }

  type AveragingPeriod {
    value: Float!
    unit: String!
  }

  input AveragingPeriodInput {
    value: Float!
    unit: String!
  }

  type LocalDate {
    local: Date!
    utc: Date!
  }

  input LocalDateInput {
    local: Date!
    utc: Date!
  }

  type LatLng {
    latitude: Float!
    longitude: Float!
  }

  input LatLngInput {
    latitude: Float!
    longitude: Float!
  }

  enum Parameter {
    ${Object.keys(AllPollutants).join('\n')}
  }

  enum SourceType {
    government
    research
    other
  }

  type Measurement {
    _id: ID!
    attribution: [Attribution!]
    averagingPeriod: AveragingPeriod
    city: String!
    coordinates: LatLng!
    country: String!
    date: LocalDate!
    location: String!
    mobile: Boolean!
    parameter: Parameter!
    sourceName: String!
    sourceNames: [String!]!
    sourceType: SourceType!
    unit: String!
    value: Float!
  }

  input CreateMeasurementInput {
    attribution: [AttributionInput!]
    averagingPeriod: AveragingPeriodInput
    city: String!
    coordinates: LatLngInput!
    country: String!
    date: LocalDateInput!
    location: String!
    mobile: Boolean!
    parameter: Parameter!
    sourceName: String!
    sourceNames: [String!]
    sourceType: SourceType!
    unit: String!
    value: Float!
  }
`;
