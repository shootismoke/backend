import { NowRequest, NowResponse } from '@now/node';

import { User } from '../../src/models';
import { connectToDatabase } from '../../src/util';

/**
 * Create a user
 */
export default async function createUser(
  req: NowRequest,
  res: NowResponse
): Promise<void> {
  try {
    await connectToDatabase();

    const data = req.body || {};

    // Select the users collection from the database
    const currentUser = await User.findOneAndUpdate(
      {
        expoInstallationId: data.expoInstallationId
      },

      // Create a new document if none exists
      {
        $setOnInsert: {
          expoInstallationId: data.expoInstallationId,
          expoPushToken: data.expoPushToken
        }
      },
      { new: true, runValidators: true, upsert: true }
    );

    // We return the user
    res.status(200).json(currentUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(422).send(error.message);

      return;
    }

    res.status(400).send(error.message);
  }
}
