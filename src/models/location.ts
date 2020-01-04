import { Document, model, Schema } from 'mongoose';

// import { Measurement as IMeasurement } from '@shootismoke/graphql';
import { dbTimestamps } from '../util';

type ILocation = any;

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

// FIXME any
export const Location = model<ILocation & Document>('Location', LocationSchema);
