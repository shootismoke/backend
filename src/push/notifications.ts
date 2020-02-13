import { Frequency, User as IUser } from '@shootismoke/graphql';
import { Document } from 'mongoose';

import { User } from '../models';
import { findTimezonesAt } from '../util';

/**
 * Show notifications at these hours of the day
 */
const NOTIFICATION_HOUR = {
  daily: 9,
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

  return User.find({
    'notifications.frequency': frequency,
    'notifications.timezone': {
      $in: timezones
    }
  });
}
