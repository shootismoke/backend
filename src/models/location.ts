import { Measurement } from '@shootismoke/graphql';
import { Document, model, Schema } from 'mongoose';

import { dbTimestamps } from '../util';

type ILocation = Pick<
  Measurement,
  | '_id'
  | 'city'
  | 'country'
  | 'location'
  | 'sourceName'
  | 'sourceNames'
  | 'sourceType'
>;

/**
 * Location model
 *
 * @see https://docs.openaq.org/#api-Locations
 */
export const LocationSchema = new Schema(
  {
    city: {
      required: true,
      type: Schema.Types.String
    },
    country: {
      required: true,
      type: Schema.Types.String
    },
    location: {
      index: true,
      required: true,
      type: Schema.Types.String,
      unique: true
    },
    sourceName: {
      required: true,
      type: Schema.Types.String
    },
    sourceNames: {
      type: [Schema.Types.String]
    },
    sourceType: {
      default: 'other',
      enum: ['government', 'research', 'other'],
      required: true,
      type: Schema.Types.String
    }
  },
  {
    strict: 'throw',
    timestamps: dbTimestamps
  }
);

export const Location = model<ILocation & Document>('Location', LocationSchema);
