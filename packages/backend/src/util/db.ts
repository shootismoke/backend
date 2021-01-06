import { connect, connection } from 'mongoose';

import { logger } from './logger';

/**
 * A function for connecting to MongoDB.
 */
export async function connectToDatabase(): Promise<void> {
	// If there's already a connection, we do nothing
	if (connection.readyState === 1) {
		return;
	}

	if (!process.env.MONGODB_ATLAS_URI) {
		const e = new Error(
			'connectToDatabase: `MONGODB_ATLAS_URI` is not defined'
		);
		logger.error(e);
		throw e;
	}

	await connect(process.env.MONGODB_ATLAS_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
}
