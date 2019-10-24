import { NowRequest, NowResponse } from '@now/node';

import { connectToDatabase } from '../../util';

/**
 * Fetch or create a user
 */
export default async function user(
  req: NowRequest,
  res: NowResponse
): Promise<void> {
  const db = await connectToDatabase();

  // Select the "users" collection from the database
  const collection = await db.collection('users');

  // Select the users collection from the database
  const users = await collection.find({}).toArray();

  res.status(200).json({ users });
}
