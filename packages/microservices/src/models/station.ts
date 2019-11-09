import { Station as IStation } from '@shootismoke/graphql/src/types';
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
    universalId: {
      index: true,
      required: true,
      type: Schema.Types.String,
      unique: true
    }
  },
  { strict: 'throw', timestamps: true }
);

export const Station = model<IStation & Document>('Station', StationSchema);
