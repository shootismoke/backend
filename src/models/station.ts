import { Document, model, Schema } from 'mongoose';

export interface StationType extends Document {
  name?: string;
  provider: 'waqi';
  providerId: string;
}

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

export const Station = model<StationType>('Station', StationSchema);
