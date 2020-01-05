import { AllPollutants } from '@shootismoke/convert';
import { Measurement as IMeasurementBase } from '@shootismoke/graphql';
import { Document, model, Schema } from 'mongoose';

import { dbTimestamps } from '../util';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface IMeasurement
  extends Pick<
    IMeasurementBase,
    | '__typename'
    | '_id'
    | 'attribution'
    | 'averagingPeriod'
    | 'coordinates'
    | 'date'
    | 'mobile'
    | 'parameter'
    | 'unit'
    | 'value'
  > {
  locationId: string;
}

export const MeasurementSchema = new Schema(
  {
    attribution: [
      new Schema({
        name: {
          required: true,
          type: Schema.Types.String
        },
        url: {
          type: Schema.Types.String
        }
      })
    ],
    averagingPeriod: {
      type: new Schema({
        unit: {
          required: true,
          type: Schema.Types.String
        },
        value: {
          required: true,
          type: Schema.Types.Number
        }
      })
    },
    coordinates: {
      required: true,
      type: new Schema({
        latitude: {
          required: true,
          type: Schema.Types.Number
        },
        longitude: {
          required: true,
          type: Schema.Types.Number
        }
      })
    },
    date: {
      required: true,
      type: new Schema({
        local: {
          required: true,
          type: Schema.Types.Date
        },
        utc: {
          required: true,
          type: Schema.Types.Date
        }
      })
    },
    locationId: {
      ref: 'Location',
      required: true,
      type: Schema.Types.ObjectId
    },
    mobile: {
      default: false,
      required: true,
      type: Schema.Types.Boolean
    },
    parameter: {
      enum: AllPollutants,
      required: true,
      type: Schema.Types.String
    },
    value: {
      required: true,
      type: Schema.Types.Number
    },
    unit: {
      enum: ['µg/m³', 'ppm'],
      required: true,
      type: Schema.Types.String
    }
  },
  { strict: 'throw', timestamps: dbTimestamps }
);

export const Measurement = model<IMeasurement & Document>(
  'Measurement',
  MeasurementSchema
);
