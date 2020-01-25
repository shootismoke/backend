import { connect } from 'mongoose';

import { logger } from './logger';

/**
 * A function for connecting to MongoDB, taking a single paramater of the
 * connection string
 *
 * @param uri - MongoDB connection string
 */
export async function connectToDatabase(uri?: string): Promise<void> {
  // If uri is not specified, we take from ENV variable
  const dbUri = uri || process.env.MONGODB_ATLAS_URI;

  if (!dbUri) {
    const e = new Error('process.env.MONGODB_ATLAS_URI is not defined');
    logger.error(e);
    throw e;
  }

  await connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
}

/**
 * Create timestamps for every document in the db, using the openaq format
 */
export const dbTimestamps = {
  createdAt: 'firstUpdated',
  updatedAt: 'lastUpdated'
};
