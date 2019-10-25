import { NowRequest, NowResponse } from '@now/node';
import * as t from 'io-ts';
import { decode } from 'io-ts-promise';

import { User } from '../../models';
import { connectToDatabase } from '../../util';

type IUser = t.TypeOf<typeof User>;

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
        $set: {
          expoInstallationId: data.expoInstallationId,
          expoPushToken: data.expoPushToken
        }
      },
      { upsert: true }
    );

    // We return
    res.status(200).json(currentUser);
  } catch (error) {
    res.status(400).send(error.message);
  }
}
