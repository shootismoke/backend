import { NowRequest, NowResponse } from '@vercel/node';

import { connectToDatabase, logger, sentrySetup } from '../src/util';

sentrySetup();

/**
 * Send email report to one user.
 */
export default async function push(
	_req: NowRequest,
	res: NowResponse
): Promise<void> {
	try {
		await connectToDatabase();
	} catch (error) {
		logger.error(error);
		res.status(500).send({ error: (error as Error).message });
	}
}
