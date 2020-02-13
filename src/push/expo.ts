import { Frequency, User } from '@shootismoke/graphql';
import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import { Document } from 'mongoose';

import { logger } from '../util';
import { pm25ToCigarettes } from './provider';

/**
 * Check if a value is an Error or an ExpoPushMessage.
 */
export function isExpoPushMessage(
  e: Error | ExpoPushMessage
): e is ExpoPushMessage {
  return !(e instanceof Error);
}

/**
 * Generate the body of the push notification message.
 */
function getMessageBody(pm25: number, frequency: Frequency): string {
  const dailyCigarettes = pm25ToCigarettes(pm25);
  if (frequency === 'daily') {
    return `Shoot! You'll smoke ${dailyCigarettes} cigarettes today`;
  }

  return `Shoot! You smoked ${
    frequency === 'monthly' ? dailyCigarettes * 30 : dailyCigarettes * 7
  } cigarettes in the past ${frequency === 'monthly' ? 'month' : 'week'}.`;
}

/**
 * For a user, construct a personalized ExpoPushMessage.
 *
 * @param user - The user to construct the message for
 */
export function constructExpoMessage(
  user: User & Document,
  cigarrettes: number
): Error | ExpoPushMessage {
  try {
    if (!user.notifications) {
      throw new Error(
        `User ${user.id} cannot not have notifications, as per our db query. qed.`
      );
    }

    if (!Expo.isExpoPushToken(user.notifications.expoPushToken)) {
      throw new Error(
        `Push token ${user.notifications.expoPushToken} is not a valid Expo push token`
      );
    }

    return {
      body: getMessageBody(cigarrettes, user.notifications.frequency),
      title: 'Sh**t! I Smoke',
      to: user.notifications.expoPushToken,
      sound: 'default'
    };
  } catch (error) {
    logger.error(error);

    return error as Error;
  }
}

/**
 * Send a batch of messages to Expo's servers.
 *
 * @see https://github.com/expo/expo-server-sdk-node
 * @param messages - The messages to send.
 */
export async function sendBatchToExpo(
  expo: Expo,
  messages: ExpoPushMessage[]
): Promise<ExpoPushTicket[]> {
  const chunks = expo.chunkPushNotifications(messages);
  const tickets: ExpoPushTicket[] = [];
  // Send the chunks to the Expo push notification service. There are
  // different strategies you could use. A simple one is to send one chunk at a
  // time, which nicely spreads the load out over time:
  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
      // NOTE: If a ticket contains an error code in ticket.details.error, you
      // must handle it appropriately. The error codes are listed in the Expo
      // documentation:
      // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
    } catch (error) {
      logger.error(error);
    }
  }

  return tickets;
}
