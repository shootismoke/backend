import { NowRequest, NowResponse } from '@now/node';
import Expo from 'expo-server-sdk';

import { PushTicket } from '../src/models';
import {
  constructExpoMessage,
  ExpoPushSuccessTicket,
  findUsersForNotifications,
  isPromiseFulfilled,
  isPromiseRejected,
  PromiseSettledResult,
  sendBatchToExpo,
  universalFetch,
  UserExpoMessage,
  whitelistIPMiddleware
} from '../src/push';
import { chain, connectToDatabase, logger, sentrySetup } from '../src/util';

sentrySetup();

/**
 * Send push notifications to all relevant users.
 */
async function push(_req: NowRequest, res: NowResponse): Promise<void> {
  try {
    await connectToDatabase(process.env.MONGODB_ATLAS_URI);

    // Fetch all users to whom we should show a notification
    const users = await findUsersForNotifications();

    // Craft a push notification message for each user
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore Wait for es2020.promise to land in TS
    const messages = (await Promise.allSettled(
      users.map()
    )) as PromiseSettledResult<UserExpoMessage>[];

    // Log the users with errors
    messages
      .filter(isPromiseRejected)
      .map(({ reason }) => reason)
      .forEach(error => logger.error(new Error(error)));

    // Find the messages that are valid
    const validMessages = messages.filter(isPromiseFulfilled);

    // Send the valid messages, we get the tickets
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
