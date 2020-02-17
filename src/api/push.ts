import { chain } from '@amaurymartiny/now-middleware';
import { NowRequest, NowResponse } from '@now/node';
import { Expo } from 'expo-server-sdk';

import { PushTicket } from '../models';
import {
  expoMessageForUser,
  ExpoPushSuccessTicket,
  findUsersForNotifications,
  isPromiseFulfilled,
  isPromiseRejected,
  PromiseSettledResult,
  sendBatchToExpo,
  UserExpoMessage,
  whitelistIPMiddleware
} from '../push';
import { connectToDatabase, logger, sentrySetup } from '../util';

sentrySetup();

/**
 * Send push notifications to all relevant users.
 */
export async function push(_req: NowRequest, res: NowResponse): Promise<void> {
  try {
    await connectToDatabase(process.env.MONGODB_ATLAS_URI);

    // Fetch all users to whom we should show a notification
    const users = await findUsersForNotifications();

    // Craft a push notification message for each user
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore Wait for es2020.promise to land in TS
    const messages = (await Promise.allSettled(
      users.map(expoMessageForUser)
    )) as PromiseSettledResult<UserExpoMessage>[];

    // Log the users with errors
    messages
      .filter(isPromiseRejected)
      .map(({ reason }) => reason)
      .forEach(error => logger.error(new Error(error)));

    // Find the messages that are valid
    const validMessages = messages.filter(isPromiseFulfilled);
    // Send the valid messages to Expo Push Server, we get the tickets
    const tickets = await sendBatchToExpo(
      new Expo(),
      validMessages.map(({ value: { pushMessage } }) => pushMessage)
    );
    await PushTicket.insertMany(
      tickets.map((ticket, index) => ({
        ...ticket,
        receiptId: (ticket as ExpoPushSuccessTicket).id,
        userId: validMessages[index].value.userId
      }))
    );

    res.send({
      status: 'ok',
      details: `Successfully sent ${validMessages.length}/${messages.length} push notifications`
    });
  } catch (error) {
    logger.error(error);

    res.status(500);
    res.send({
      status: 'error',
      details: error.message
    });
  }
}

export default chain(whitelistIPMiddleware)(push);
