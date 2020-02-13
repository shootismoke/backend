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
    type: Schema.Types.String
  }
});

/**
 * @see https://docs.expo.io/versions/latest/guides/push-notifications/#push-ticket-format
 */
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
      type: Schema.Types.String
    },
    /**
     * Ticket status
     */
    status: {
      enum: ['ok', 'error'],
      required: true,
      type: Schema.Types.String
    },
    /**
     * The user associated to the ticket.
     */
    userId: {
      ref: 'User',
      type: Schema.Types.ObjectId
    }
  },
  { strict: 'throw', timestamps: true }
);

export const PushTicket = model<ExpoPushTicket & Document>(
  'PushTicket',
  PushTicketSchema
);
