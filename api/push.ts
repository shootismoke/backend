import { NowRequest, NowResponse } from '@now/node';

import { PushTicket } from '../src/models';
import {
  constructExpoMessage,
  findUsersForNotifications,
  isExpoPushMessage,
  sendBatchToExpo
} from '../src/push';
import { connectToDatabase, logger, sentrySetup } from '../src/util';

sentrySetup();

export default async function(
  _req: NowRequest,
  res: NowResponse
): Promise<void> {
  try {
    await connectToDatabase(process.env.MONGODB_ATLAS_URI);

    // Fetch all users to whom we should show a notification
    const users = (
      await Promise.all(
        (['daily', 'weekly', 'monthly'] as const).map(findUsersForNotifications)
      )
    ).flat();

    const messages = await Promise.all(users.map(constructExpoMessage));
    const validMessages = messages.filter(isExpoPushMessage);
    const tickets = await sendBatchToExpo(validMessages);
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
