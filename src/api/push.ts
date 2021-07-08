import { chain } from '@amaurym/now-middleware';
import { NowRequest, NowResponse } from '@vercel/node';
import { Expo, ExpoPushSuccessTicket } from 'expo-server-sdk';

import { PushTicket } from '../models';
import {
	expoMessageForUser,
	findUsersForNotifications,
	isPromiseFulfilled,
	isPromiseRejected,
	sendBatchToExpo,
	whitelistIPMiddleware,
} from '../push';
import { connectToDatabase, logger, sentrySetup } from '../util';

sentrySetup();

/**
 * Send push notifications to all relevant users.
 */
export async function push(_req: NowRequest, res: NowResponse): Promise<void> {
	try {
		await connectToDatabase(process.env.MONGODB_ATLAS_URI);

		// Fetch all users to whom we should show a notification
		const users = await findUsersForNotifications();

		// Craft a push notification message for each user
		const messages = await Promise.allSettled(
			users.map(expoMessageForUser)
		);

		// Log the users with errors
		messages
			.filter(isPromiseRejected)
			.map(({ reason }) => reason as string)
			.forEach((error) => logger.error(new Error(error)));

		// Find the messages that are valid
		const validMessages = messages.filter(isPromiseFulfilled);
		// Send the valid messages to Expo Push Server, we get the tickets
		const tickets = await sendBatchToExpo(
			new Expo(),
			validMessages.map(({ value: { pushMessage } }) => pushMessage)
		);
		await PushTicket.insertMany(
			tickets.map((ticket, index) => ({
				...ticket,
				receiptId: (ticket as ExpoPushSuccessTicket).id,
				userId: validMessages[index].value.userId,
			}))
		);

		res.send({
			status: 'ok',
			details: `Successfully sent ${validMessages.length}/${messages.length} push notifications`,
		});
	} catch (error) {
		logger.error(error);

		res.status(500);
		res.send({
			status: 'error',
			details: error.message,
		});
	}
}

export default chain(whitelistIPMiddleware)(push);
