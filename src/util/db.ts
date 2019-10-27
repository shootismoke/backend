import { connect } from 'mongoose';

/**
 * A function for connecting to MongoDB, taking a single paramater of the
 * connection string
 * @param uri - MongoDB connection string
 */
export async function connectToDatabase(): Promise<void> {
  if (!process.env.MONGODB_ATLAS_URI) {
    throw new Error('process.env.MONGODB_ATLAS_URI is not defined');
  }

  await connect(
    process.env.MONGODB_ATLAS_URI,
    {
      useNewUrlParser: true
    }
  );
}
