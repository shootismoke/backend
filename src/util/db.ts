import { connect } from 'mongoose';

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
    throw new Error('process.env.MONGODB_ATLAS_URI is not defined');
  }

  await connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
}
