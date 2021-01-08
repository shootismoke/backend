import { NowRequest, NowResponse } from '@vercel/node';
import { Expo, ExpoPushSuccessTicket } from 'expo-server-sdk';

import {
	expoMessageForUser,
	isWhitelisted,
	sendBatchToExpo,
} from '../src/expoReport';
import { PushTicket, User } from '../src/models';
import {
	assertUser,
	connectToDatabase,
	logger,
	sentrySetup,
} from '../src/util';

sentrySetup();

/**
 * Send push notifications to a particular user.
 */
export default async function push(
	req: NowRequest,
	res: NowResponse
): Promise<void> {
	try {
		const ip = req.headers['x-forwarded-for'] as string;

		if (!isWhitelisted(ip)) {
			res.status(403);
			res.send({
				error: `IP address not whitelisted: ${ip}`,
			});
			res.end();
		}

		switch (req.method) {
			case 'POST': {
				await connectToDatabase();

				// TODO We now call this endpoint for each user, at the time specified
				// for said user in the crontab. Should we double check that the
				// current time of execution of this function matches the cron
				// expression in the DB for this user?
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				const user = await User.findById(req.body.userId).exec();
				assertUser(user, req.query.userId as string);

				// Craft a push notification message for each user
				const message = await expoMessageForUser(user);

				// We use the sendBatch function, but we actually only send one push
				// notification.
				const [ticket] = await sendBatchToExpo(new Expo(), [
					message.pushMessage,
				]);
				const pushTicket = new PushTicket({
					...ticket,
					receiptId: (ticket as ExpoPushSuccessTicket).id,
					userId: message.pushMessage,
				});
				await pushTicket.save();

				res.send({
					details: `Successfully sent push notification to Expo server, with receiptId ${ticket.receiptId}`,
				});

				break;
			}

			default: {
				res.status(405).json({
					error: `Unknown request method: ${
						req.method || 'undefined'
					}`,
				});
			}
		}
	} catch (error) {
		logger.error(error);

		res.status(500);
		res.send({
			error: (error as Error).message,
		});
	}
}
