import { Frequency, User as IUser } from '@shootismoke/graphql';
import { Document } from 'mongoose';

import { PushTicket, User } from '../models';
import { findTimezonesAt } from '../util';

/**
 * Show notifications at these hours of the day
 */
const NOTIFICATION_HOUR = {
  daily: 22,
  weekly: 21,
  monthly: 21
};

/**
 * Find in DB all users to show notifications with frequency `frequency`.
 *
 * @param frequency - The frequency to show the timezones.
 */
export async function findUsersForNotifications(
  frequency: Frequency
): Promise<(IUser & Document)[]> {
  const today = new Date();
  let timezones: string[] = [];
  if (frequency === 'daily') {
    timezones = findTimezonesAt(NOTIFICATION_HOUR.daily);
  } else if (frequency === 'weekly' && today.getUTCDay() === 0) {
    // Show weekly notifications on Sundays
    timezones = findTimezonesAt(NOTIFICATION_HOUR.weekly);
  } else if (frequency === 'monthly' && today.getUTCDate() === 1) {
    // Show monthly notifications on the 1st of the month
    timezones = findTimezonesAt(NOTIFICATION_HOUR.monthly);
  }

  return User.aggregate([
    // Get all users matching frequency and timezone.
    {
      $match: {
        'notifications.frequency': frequency,
        'notifications.timezone': {
          $in: timezones
        }
      }
    },
    // Check if user has any active pushTickets from Expo.
    {
      $lookup: {
        as: 'pushTickets',
        from: PushTicket.collection.name,
        localField: '_id',
        foreignField: 'userId'
      }
    },
    // Only return users with no puchTickets.
    {
      $match: {
        pushTickets: { $size: 0 }
      }
    }
  ]);
}
