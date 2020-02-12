import { ExpoPushTicket } from 'expo-server-sdk';
import { Document, model, Schema } from 'mongoose';

const PushTicketErrorDetailsSchema = new Schema({
  error: {
    enum: [
      'DeviceNotRegistered',
      'InvalidCredentials',
      'MessageTooBig',
      'MessageRateExceeded'
    ],
    type: Schema.Types.String,
    unique: true
  }
});

const PushTicketSchema = new Schema(
  {
    /**
     * Error details.
     */
    details: {
      type: PushTicketErrorDetailsSchema
    },
    /**
     * Error message.
     */
    message: {
      required: function (): boolean {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore Using this syntax from mongoose docs.
        return this.status === 'error';
      },
      type: Schema.Types.String
    },
    /**
     * Receipt id.
     */
    receiptId: {
      required: function (): boolean {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore Using this syntax from mongoose docs.
        return this.status === 'ok';
      },
      type: Schema.Types.String
    },
    status: {
      enum: ['ok', 'error'],
      required: true,
      type: Schema.Types.String
    }
  },
  { strict: 'throw', timestamps: true }
);

export const PushTicket = model<ExpoPushTicket & Document>(
  'PushTicket',
  PushTicketSchema
);
