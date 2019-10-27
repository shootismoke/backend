import { Db, MongoClient } from 'mongodb';
import { parse } from 'url';

import { IUser } from '../models';

// Create cached connection variables
let cachedClient: MongoClient | null;
let cachedDb: Db | null = null;

export async function getMongoClient(): Promise<MongoClient> {
  // If the database connection is cached,
  // use it instead of creating a new connection
  if (cachedClient) {
    return cachedClient;
  }

  if (!process.env.MONGODB_ATLAS_URI) {
    throw new Error('process.env.MONGODB_ATLAS_URI is not defined');
  }
  const uri = process.env.MONGODB_ATLAS_URI;

  // If no connection is cached, create a new one
  const client = await MongoClient.connect(uri, {
    /*
    Buffering allows Mongoose to queue up operations if MongoDB
    gets disconnected, and to send them upon reconnection.
    With serverless, it is better to fail fast when not connected.
  */
    bufferMaxEntries: 0,
    useNewUrlParser: true
  });

  cachedClient = client;
  return client;
}

/**
 * A function for connecting to MongoDB, taking a single paramater of the
 * connection string
 * @param uri - MongoDB connection string
 */
export async function connectToDatabase(): Promise<Db> {
  // If the database connection is cached,
  // use it instead of creating a new connection
  if (cachedDb) {
    return cachedDb;
  }

  if (!process.env.MONGODB_ATLAS_URI) {
    throw new Error('process.env.MONGODB_ATLAS_URI is not defined');
  }
  const uri = process.env.MONGODB_ATLAS_URI;

  const client = await getMongoClient();

  // Select the database through the connection, using the database path of the
  // connection string
  const parsed = parse(uri);
  if (!parsed.pathname) {
    throw new Error('Cannot find pathname in connection string');
  }
  const db = client.db(parsed.pathname.substr(1));

  // Create indexes
  // FIXME It doesn't seem clean to me to put this here
  const Users = db.collection<IUser>('users');
  Users.createIndex({ expoInstallationId: 1 }, { unique: true });

  // Cache the database connection and return the connection
  cachedDb = db;
  return db;
}
