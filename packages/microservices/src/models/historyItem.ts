import { HistoryItem as IHistoryItem } from '@shootismoke/graphql/src';
import { Document, model, Schema } from 'mongoose';

export const HistoryItemSchema = new Schema(
  {
    createdAt: {
      default: (): number => Date.now(),
      required: true,
      type: Schema.Types.Date
    },
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
  { strict: 'throw' }
);

export const HistoryItem = model<IHistoryItem & Document>(
  'HistoryItem',
  HistoryItemSchema
);
