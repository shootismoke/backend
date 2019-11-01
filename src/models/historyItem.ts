import { Document, model, Schema } from 'mongoose';

export interface HistoryItemType extends Document {
  createdAt: Date;
  rawPm25: number;
  stationId: string;
}

export const HistoryItemSchema = new Schema(
  {
    createdAt: {
      default: Date.now,
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

export const HistoryItem = model<HistoryItemType>(
  'HistoryItem',
  HistoryItemSchema
);
