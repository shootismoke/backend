import { NowRequest, NowResponse } from '@now/node';
import { captureException, init } from '@sentry/node';
import {
  AllProviders,
  OpenAQFormat,
  ProviderPromise
} from '@shootismoke/dataproviders';
import { aqicn, openaq, waqi } from '@shootismoke/dataproviders/lib/promise';
import { Frequency } from '@shootismoke/graphql';
import { ExpoPushMessage } from 'expo-server-sdk';

import { User } from '../src/models';
import {
  connectToDatabase,
  findTimezonesAt,
  IS_SENTRY_SET_UP
} from '../src/util';

if (process.env.SENTRY_DSN) {
  init({
    dsn: process.env.SENTRY_DSN
  });
}

/**
 * Convert raw pm25 level to number of cigarettes. 1 cigarette is equivalent of
 * a PM2.5 level of 22ug/m3.
 *
 * @see http://berkeleyearth.org/air-pollution-and-cigarette-equivalence/
 * @param rawPm25 - The raw PM2.5 level, in ug/m3
 */
export function pm25ToCigarettes(rawPm25: number): number {
  return rawPm25 / 22;
}

/**
 * Given some normalized data points, filter out the first one that contains
 * pm25 data. Returns a TaskEither left is none is found, or format the data
 * into the Api interface
 *
 * @param normalized - The normalized data to process
 */
async function providerFetch<DataByGps, DataByStation, Options>(
  provider: ProviderPromise<DataByGps, DataByStation, Options>,
  station: string
): Promise<OpenAQFormat> {
  const normalized = provider.normalizeByStation(
    await provider.fetchByStation(station)
  );
  const pm25 = normalized.filter(({ parameter }) => parameter === 'pm25');

  if (pm25.length) {
    return pm25[0];
  } else {
    throw new Error(
      `PM2.5 has not been measured by station ${normalized[0].location} right now`
    );
  }
}

/**
 * Fetch data from correct provider, based on universalId.
 *
 * @param universalId - The universalId of the station
 */
async function universalFetch(universalId: string): Promise<OpenAQFormat> {
  const [provider, station] = universalId.split('|');

  const providers = { aqicn, openaq, waqi };

  if (!AllProviders.includes(provider)) {
    throw new Error(
      `universalFetch: Unrecognized universalId "${universalId}".`
    );
  }

  return await providerFetch(
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore FIXME why doesn't this work?
    providers[provider as keyof typeof providers],
    station
  );
}

/**
 * Check if a value is an Error or an ExpoPushMessage.
 */
function isExpoPushMessage(e: Error | ExpoPushMessage): e is ExpoPushMessage {
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

// Show notifications at these hours of the day
const DAILY_NOTIFICATION_HOUR = 9;
const WEEKLY_NOTIFICATION_HOUR = 21;
const MONTHLY_NOTIFICATION_HOUR = 21;

export default async function(
  _req: NowRequest,
  res: NowResponse
): Promise<void> {
  await connectToDatabase(process.env.MONGODB_ATLAS_URI);

  const today = new Date();
  // Find timezones to show notifications
  const dailyTimezones = findTimezonesAt(DAILY_NOTIFICATION_HOUR);
  // Show weekly notifications on Sundays
  const weeklyTimezones =
    today.getUTCDay() === 0 ? findTimezonesAt(WEEKLY_NOTIFICATION_HOUR) : [];
  // Show monthly notifications on the 1st of the month
  const monthlyTimezones =
    today.getUTCDate() === 1 ? findTimezonesAt(MONTHLY_NOTIFICATION_HOUR) : [];

  const users = await User.find({
    'notifications.timezone': {
      $in: dailyTimezones.concat(weeklyTimezones).concat(monthlyTimezones)
    }
  });

  // All the values we get from providers
  const messages = await Promise.all(
    users.map(async user => {
      try {
        if (!user.notifications) {
          throw new Error(`User ${user.id} has no notifications`);
        }

        const { value } = await universalFetch(user.notifications.universalId);

        return {
          body: getMessageBody(value, user.notifications.frequency),
          title: 'Sh**t! I Smoke',
          to: user.notifications.expoPushToken,
          pm25: value
        } as ExpoPushMessage;
      } catch (error) {
        IS_SENTRY_SET_UP && captureException(error);

        return error as Error;
      }
    })
  );

  res.send(
    JSON.stringify({
      status: 'ok',
      data: `Successfully sent ${messages.filter(isExpoPushMessage).length}/${
        messages.length
      } push notifications`
    })
  );
}
