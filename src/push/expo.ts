import { Frequency, User } from '@shootismoke/graphql';
import {
  Expo,
  ExpoPushMessage,
  ExpoPushReceipt,
  ExpoPushReceiptId,
  ExpoPushTicket
} from 'expo-server-sdk';
import { Document } from 'mongoose';

import { logger } from '../util';
import { pm25ToCigarettes } from './provider';

// https://github.com/expo/expo-server-sdk-node/pull/33
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExpoPushSuccessTicket = any;

/**
 * From the Promise.allSettled spec.
 * @see https://github.com/microsoft/TypeScript/pull/34065/files#diff-64d620455dae680966727ed5c2ccd4d6R6
 */
export interface PromiseRejectedResult {
  status: 'rejected';
  reason: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

/**
 * An Expo message associated with the user.
 */
export interface UserExpoMessage {
  userId: string;
  pushMessage: ExpoPushMessage;
}

/**
 * Check if a value is an Error or an ExpoPushMessage.
 */
export function isUserExpoMessage(
  e: UserExpoMessage | PromiseRejectedResult
): e is UserExpoMessage {
  return !!(
    (e as UserExpoMessage).pushMessage && (e as UserExpoMessage).pushMessage.to
  );
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
  pm25: number
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
      body: getMessageBody(pm25, user.notifications.frequency),
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

/**
 * Handle Expo push receipts.
 *
 * @param expo - Expo class instance.
 * @param receiptIds - The receipt IDs to handle.
 * @param onOk - Handler on successful receipt.
 * @param onError - Handler on error receipt.
 */
export async function handleReceipts(
  expo: Expo,
  receiptIds: string[],
  onOk: (receiptId: ExpoPushReceiptId, receipt: ExpoPushReceipt) => void,
  onError: (receiptId: ExpoPushReceiptId, receipt: ExpoPushReceipt) => void
): Promise<void> {
  const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  for (const chunk of receiptIdChunks) {
    try {
      const receipts = await expo.getPushNotificationReceiptsAsync(chunk);

      // The receipts specify whether Apple or Google successfully received the
      // notification and information about an error, if one occurred.
      for (const [receiptId, receipt] of Object.entries(receipts)) {
        if (receipt.status === 'ok') {
          onOk(receiptId, receipt);
        } else if (receipt.status === 'error') {
          onError(receiptId, receipt);
        }
      }
    } catch (error) {
      logger.error(error);
    }
  }
}
