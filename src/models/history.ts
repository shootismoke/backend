import { Document, model, Schema } from 'mongoose';

export interface HistoryType extends Document {
  createdAt: Date;
  rawPm25: number;
  stationId: string;
}

export const HistorySchema = new Schema({
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
    required: true,
    type: Schema.Types.String
  },
  userId: {
    ref: 'User',
    required: true,
    type: Schema.Types.ObjectId
  }
});

export const History = model<HistoryType>('history', HistorySchema);
