import { NowRequest, NowResponse } from '@now/node';
import Expo, { ExpoPushMessage } from 'expo-server-sdk';

import { PushTicket } from '../src/models';
import {
  constructExpoMessage,
  ExpoPushSuccessTicket,
  findUsersForNotifications,
  isExpoPushMessage,
  sendBatchToExpo,
  universalFetch,
  whitelisted
} from '../src/push';
import { connectToDatabase, IS_PROD, logger, sentrySetup } from '../src/util';

sentrySetup();

/**
 * Send push notifications to all relevant users.
 */
export default async function(
  req: NowRequest,
  res: NowResponse
): Promise<void> {
  try {
    if (IS_PROD && !whitelisted(req)) {
      res.status(401);
      res.send({
        status: 'error',
        details: `Not a whitelisted IP address`
      });

      return;
    }

    await connectToDatabase(process.env.MONGODB_ATLAS_URI);

    // Fetch all users to whom we should show a notification
    const users = (
      await Promise.all(
        (['daily', 'weekly', 'monthly'] as const).map(findUsersForNotifications)
      )
    ).flat();

    // Craft a push notification message for each user
    const messages = await Promise.all(
      users.map(async user => {
        if (!user.notifications) {
          throw new Error(
            `User ${user.id} cannot not have notifications, as per our db query. qed.`
          );
        }

        // FIXME add retries + timeout
        const { value } = await universalFetch(user.notifications.universalId);

        return {
          userId: user._id,
          message: constructExpoMessage(user, value)
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
