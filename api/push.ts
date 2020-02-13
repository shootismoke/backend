import { NowRequest, NowResponse } from '@now/node';
import Expo from 'expo-server-sdk';

import { PushTicket } from '../src/models';
import {
  constructExpoMessage,
  findUsersForNotifications,
  isExpoPushMessage,
  sendBatchToExpo,
  universalFetch
} from '../src/push';
import { connectToDatabase, logger, sentrySetup } from '../src/util';

sentrySetup();

/**
 * Whitelist this endpoint to only IP addresses from easycron.com.
 *
 * @see https://www.easycron.com/ips
 */
function whitelisted(req: NowRequest): boolean {
  const whitelist = [
    '198.27.83.222',
    '198.27.81.205',
    '198.27.81.189',
    '198.27.81.189',
    '2607:5300:60:24de::',
    '2607:5300:60:22cd::',
    '2607:5300:60:22bd::',
    '2607:5300:60:4b6e::'
  ];

  return whitelist.includes(req.headers.forwarded || '');
}

export default async function (
  req: NowRequest,
  res: NowResponse
): Promise<void> {
  try {
    if (!whitelisted(req)) {
      res.send({
        status: 'error',
        details: `${req.headers.forwarded} is not allowed`
      });
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

        return constructExpoMessage(user, value);
      })
    );
    const validMessages = messages.filter(isExpoPushMessage);
    const tickets = await sendBatchToExpo(new Expo(), validMessages);
    await PushTicket.insertMany(tickets);

    res.send(
      JSON.stringify({
        status: 'ok',
        details: `Successfully sent ${validMessages.length}/${messages.length} push notifications`
      })
    );
  } catch (error) {
    logger.error(error);

    res.send(
      JSON.stringify({
        status: 'error',
        details: error.message
      })
    );
  }
}
