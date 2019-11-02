import { Station as IStation } from '@shootismoke/graphql';
import { Document, model, Schema } from 'mongoose';

export const StationSchema = new Schema(
  {
    name: {
      required: true,
      type: Schema.Types.String
    },
    provider: {
      enum: ['waqi'],
      required: true,
      type: Schema.Types.String
    },
    providerId: {
      index: true,
      required: true,
      type: Schema.Types.String,
      unique: true
    }
  },
  { strict: 'throw' }
);

export const Station = model<IStation & Document>('Station', StationSchema);
