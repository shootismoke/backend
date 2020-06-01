import { Frequency, User as IUser } from '@shootismoke/graphql';
import { Document } from 'mongoose';

import { PushTicket, User } from '../models';
import { findTimezonesAt } from '../util';

/**
 * Show notifications at these hours of the day.
 */
const NOTIFICATION_HOUR = {
	daily: 9,
	weekly: 21,
	monthly: 21,
};

/**
 * Based on the time now and the frequency of notifications, find the timezones
 * that should receive a notifications now.
 *
 * @param frequency - The frequency of notifications.
 * @param now - The time now.
 */
export function getTimezones(frequency: Frequency, now: Date): string[] {
	let timezones: string[] = [];
	if (frequency === 'daily') {
		timezones = findTimezonesAt(NOTIFICATION_HOUR.daily, now);
	} else if (frequency === 'weekly' && now.getUTCDay() === 0) {
		// Show weekly notifications on Sundays
		timezones = findTimezonesAt(NOTIFICATION_HOUR.weekly, now);
	} else if (frequency === 'monthly' && now.getUTCDate() === 1) {
		// Show monthly notifications on the 1st of the month
		timezones = findTimezonesAt(NOTIFICATION_HOUR.monthly, now);
	}

	return timezones;
}

/**
 * Generate the mongodb users aggregation pipeline for finding users to send
 * notifications to.
 */
export function usersPipeline(frequency: Frequency, now: Date): unknown[] {
	const timezones = getTimezones(frequency, now);

	return [
		// Get all users matching frequency and timezone.
		{
			$match: {
				'notifications.frequency': frequency,
				'notifications.timezone': {
					$in: timezones,
				},
			},
		},
		// Check if user has any active pushTickets from Expo.
		{
			$lookup: {
				as: 'pushTickets',
				from: PushTicket.collection.name,
				localField: '_id',
				foreignField: 'userId',
			},
		},
		// Only return users with no puchTickets.
		{
			$match: {
				pushTickets: { $size: 0 },
			},
		},
	];
}

/**
 * Find in DB all users to show notifications with frequency `frequency`.
 *
 * @param frequency - The frequency to show the timezones.
 * @todo Unpure.
 */
export async function findUsersForNotifications(): Promise<
	(IUser & Document)[]
> {
	const now = new Date();
	// Return a tuple [dailyUsers, weeklyUsers, monthlyUsers]
	const allUsers = await Promise.all(
		(['daily', 'weekly', 'monthly'] as const).map((frequency) =>
			User.aggregate(usersPipeline(frequency, now))
		)
	);

	return allUsers.flat() as (IUser & Document)[];
}
