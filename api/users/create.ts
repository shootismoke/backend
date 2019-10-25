import { NowRequest, NowResponse } from '@now/node';
import { decode } from 'io-ts-promise';

import { IUser, User } from '../../src/models';
import { connectToDatabase } from '../../src/util';

/**
 * Create a user
 */
export default async function createUser(
  req: NowRequest,
  res: NowResponse
): Promise<void> {
  try {
    let data: IUser | undefined;
    try {
      data = await decode(User, req.body);
    } catch (error) {
      res.status(422).send(error.message);

      return;
    }

    const db = await connectToDatabase();

    // Select the "users" collection from the database
    const Users = db.collection<IUser>('users');

    // Select the users collection from the database
    const currentUser = await Users.findOneAndUpdate(
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
      { returnOriginal: true, upsert: true }
    );

    // We return the user
    res.status(200).json(currentUser.value);
  } catch (error) {
    res.status(400).send(error.message);
  }
}
