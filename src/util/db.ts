import { connect, connection } from 'mongoose';

import { logger } from './logger';

/**
 * A function for connecting to MongoDB, taking a single paramater of the
 * connection string
 *
 * @param uri - MongoDB connection string
 */
export async function connectToDatabase(uri?: string): Promise<void> {
  // If there's already a connection, we do nothing
  if (connection.readyState === 1) {
    return;
  }

  if (!uri) {
    const e = new Error('connectToDatabase: `uri` is not defined');
    logger.error(e);
    throw e;
  }

  await connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
}

/**
 * Create timestamps for every document in the db, using the openaq format
 */
export const dbTimestamps = {
  createdAt: 'firstUpdated',
  updatedAt: 'lastUpdated',
};
