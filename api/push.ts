import { NowRequest, NowResponse } from '@now/node';
import retry from 'async-retry';
import Expo, { ExpoPushMessage } from 'expo-server-sdk';
import promiseAny from 'p-any';

import { PushTicket } from '../src/models';
import {
  assertWhitelistedIP,
  constructExpoMessage,
  ExpoPushSuccessTicket,
  findUsersForNotifications,
  isExpoPushMessage,
  sendBatchToExpo,
  universalFetch
} from '../src/push';
import { connectToDatabase, logger, sentrySetup } from '../src/util';

sentrySetup();

/**
 * Send push notifications to all relevant users.
 */
export default async function(
  req: NowRequest,
  res: NowResponse
): Promise<void> {
  try {
    if (!assertWhitelistedIP(req, res)) {
      return;
    }

    await connectToDatabase(process.env.MONGODB_ATLAS_URI);

    // Fetch all users to whom we should show a notification
    const users = await findUsersForNotifications();

    // Craft a push notification message for each user
    const messages = await Promise.all(
      users.map(async user => {
        // Find the PM2.5 value at the user's last known station (universalId)
        const pm25 = await promiseAny([
          // If anything throws, we retry
          retry(
            async () => {
              if (!user.notifications) {
                throw new Error(
                  `User ${user.id} cannot not have notifications, as per our db query. qed.`
                );
              }

              const { value } = await universalFetch(
                user.notifications.universalId
              );

              return value;
            },
            {
              retries: 5
            }
          ),
          // Timeout after 5s, because the whole Now function only runs 10s
          new Promise<number>((_resolve, reject) => setTimeout(reject, 5000))
        ]);

        return {
          userId: user._id,
          message: constructExpoMessage(user, pm25)
        };
      })
    );
    // Find the messages that are valid
    const validMessages = messages.filter(({ message }) =>
      isExpoPushMessage(message)
    );
    // Send the valid messages, we get the tickets
    const tickets = await sendBatchToExpo(
      new Expo(),
      validMessages.map(({ message }) => message as ExpoPushMessage)
    );
    await PushTicket.insertMany(
      tickets.map((ticket, index) => ({
        ...ticket,
        receiptId: (ticket as ExpoPushSuccessTicket).id,
        userId: validMessages[index].userId
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
