import { Frequency, Notifications, User } from '@shootismoke/graphql';
import {
  Expo,
  ExpoPushMessage,
  ExpoPushReceipt,
  ExpoPushReceiptId,
  ExpoPushTicket,
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
interface PromiseFulfilledResult<T> {
  status: 'fulfilled';
  value: T;
}
interface PromiseRejectedResult {
  status: 'rejected';
  reason: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}
export type PromiseSettledResult<T> =
  | PromiseFulfilledResult<T>
  | PromiseRejectedResult;

/**
 * Check if a Promise is fulfilled.
 */
export function isPromiseFulfilled<T>(
  p: PromiseSettledResult<T>
): p is PromiseFulfilledResult<T> {
  return p.status === 'fulfilled';
}

/**
 * Check if a Promise is rejected.
 */
export function isPromiseRejected<T>(
  p: PromiseSettledResult<T>
): p is PromiseRejectedResult {
  return p.status === 'rejected';
}

/**
 * An Expo message associated with the user.
 */
export interface UserExpoMessage {
  userId: string;
  pushMessage: ExpoPushMessage;
}

/**
 * Round a number to 1 decimal.
 *
 * @param n - The number to round.
 */
function roundTo1Decimal(n: number): number {
  return Math.round(n * 10) / 10;
}

/**
 * Generate the body of the push notification message.
 */
function getMessageBody(pm25: number, frequency: Frequency): string {
  const dailyCigarettes = pm25ToCigarettes(pm25);

  if (frequency === 'daily') {
    return `Shoot! You'll smoke ${roundTo1Decimal(
      dailyCigarettes
    )} cigarettes today`;
  }

  return `Shoot! You smoked ${roundTo1Decimal(
    frequency === 'monthly' ? dailyCigarettes * 30 : dailyCigarettes * 7
  )} cigarettes in the past ${frequency === 'monthly' ? 'month' : 'week'}.`;
}

/**
 * A user that has notifications.
 */
interface UserWithNotifications extends User {
  notifications: Notifications;
}

/**
 * Asserts user has notifications.
 *
 * @param user - User to test if she/he has notifications.
 */
export function assertUserNotifications(
  user: User
): asserts user is UserWithNotifications {
  if (!user.notifications) {
    throw new Error(
      `User ${user._id} has notifications, as per our db query. qed.`
    );
  }
}

/**
 * For a user, construct a personalized ExpoPushMessage.
 *
 * @param user - The user to construct the message for
 */
export function constructExpoMessage(
  user: User & Document,
  pm25: number
): ExpoPushMessage {
  assertUserNotifications(user);

  const { frequency, expoPushToken } = user.notifications;

  if (!Expo.isExpoPushToken(expoPushToken)) {
    throw new Error(`Invalid ExpoPushToken: ${expoPushToken}`);
  }

  return {
    body: getMessageBody(pm25, frequency),
    title:
      frequency === 'daily'
        ? 'Daily forecast'
        : frequency === 'weekly'
        ? 'Weekly report'
        : 'Monthly report',
    to: expoPushToken,
    sound: 'default',
  };
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
      // On error when sending push notifications, we log the error, but move
      // on with the loop.
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
      // On error when sending push notifications, we log the error, but move
      // on with the loop.
      logger.error(error);
    }
  }
}
