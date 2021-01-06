import { NowRequest, NowResponse } from '@vercel/node';
import assignDeep from 'assign-deep';

import { IUser, PushTicket, User } from '../../src/models';
import { connectToDatabase, logger, sentrySetup } from '../../src/util';

sentrySetup();

/**
 * Assert that we have a user.
 */
function assertUser(user: IUser | null, userId: string): asserts user is IUser {
	if (!user) {
		const e = new Error(`No user with userId "${userId}" found`);
		logger.error(e);
		throw e;
	}
}

export default async function usersUserId(
	req: NowRequest,
	res: NowResponse
): Promise<void> {
	try {
		await connectToDatabase();

		switch (req.method) {
			case 'GET': {
				const user = await User.findById(req.query.userId);
				assertUser(user, req.query.userId as string);

				res.status(200).json(user);

				break;
			}

			case 'PATCH': {
				const user = await User.findById(req.query.userId);

				assignDeep(user, req.body);

				const newUser = await user.save({ validateBeforeSave: true });

				// Everytime we update user, we also delete all the pushTickets he/she
				// might have.
				await PushTicket.deleteMany({
					userId: user._id,
				});

				break;
			}

			default:
				res.status(400).json({
					error: `Unknown request method: ${req.method}`,
				});
		}
	} catch (err) {
		logger.error(err);
		res.status(500).json({ error: err });
	}
}
