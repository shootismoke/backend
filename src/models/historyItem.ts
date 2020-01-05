import { HistoryItem as IHistoryItem } from '@shootismoke/graphql';
import { Document, model, Schema } from 'mongoose';

import { dbTimestamps } from '../util';

export const HistoryItemSchema = new Schema(
  {
    measurementId: {
      ref: 'Measurement',
      required: true,
      type: Schema.Types.ObjectId
    },
    userId: {
      ref: 'User',
      required: true,
      type: Schema.Types.ObjectId
    }
  },
  { strict: 'throw', timestamps: dbTimestamps }
);

export const HistoryItem = model<IHistoryItem & Document>(
  'HistoryItem',
  HistoryItemSchema
);
