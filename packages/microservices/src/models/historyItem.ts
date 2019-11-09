import { HistoryItem as IHistoryItem } from '@shootismoke/graphql/src/types';
import { Document, model, Schema } from 'mongoose';

export const HistoryItemSchema = new Schema(
  {
    rawPm25: {
      required: true,
      type: Schema.Types.Number
    },
    stationId: {
      ref: 'Station',
      required: true,
      type: Schema.Types.ObjectId
    },
    userId: {
      ref: 'User',
      required: true,
      type: Schema.Types.ObjectId
    }
  },
  { strict: 'throw', timestamps: true }
);

export const HistoryItem = model<IHistoryItem & Document>(
  'HistoryItem',
  HistoryItemSchema
);
