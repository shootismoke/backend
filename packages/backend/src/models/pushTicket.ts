import { ExpoPushTicket } from 'expo-server-sdk';
import { Document, model, Schema } from 'mongoose';

type IPushTicketBase = Omit<
	ExpoPushTicket & {
		receiptId?: string;
		userId: string;
	},
	'id'
>;

export interface IPushTicket extends IPushTicketBase, Document {}

const PushTicketErrorDetailsSchema = new Schema({
	error: {
		enum: [
			'DeviceNotRegistered',
			'InvalidCredentials',
			'MessageTooBig',
			'MessageRateExceeded',
		],
		type: Schema.Types.String,
	},
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
			type: PushTicketErrorDetailsSchema,
		},
		/**
		 * Error message.
		 */
		message: {
			required: function (): boolean {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore Using this syntax from mongoose docs.
				return this.status === 'error';
			},
			type: Schema.Types.String,
		},
		/**
		 * Receipt id.
		 */
		receiptId: {
			type: Schema.Types.String,
		},
		/**
		 * Ticket status
		 */
		status: {
			enum: ['ok', 'error'],
			required: true,
			type: Schema.Types.String,
		},
		/**
		 * The user associated to the ticket.
		 */
		userId: {
			ref: 'User',
			required: true,
			type: Schema.Types.ObjectId,
		},
	},
	{ strict: 'throw', timestamps: true }
);

export const PushTicket = model<IPushTicket>('PushTicket', PushTicketSchema);
