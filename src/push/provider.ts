import { AllProviders, OpenAQFormat } from '@shootismoke/dataproviders';
import { aqicn, openaq, waqi } from '@shootismoke/dataproviders/lib/promise';
import { User } from '@shootismoke/graphql';
import retry from 'async-retry';
import { Document } from 'mongoose';

import {
  assertUserNotifications,
  constructExpoMessage,
  UserExpoMessage,
} from './expo';

type AllProviders = 'aqicn' | 'openaq' | 'waqi';

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
async function providerFetch(
  provider: AllProviders,
  station: string
): Promise<OpenAQFormat> {
  const normalized =
    provider === 'aqicn'
      ? aqicn.normalizeByStation(
          await aqicn.fetchByStation(station, {
            token: process.env.AQICN_TOKEN as string,
          })
        )
      : provider === 'waqi'
      ? waqi.normalizeByStation(await waqi.fetchByStation(station))
      : openaq.normalizeByStation(
          await openaq.fetchByStation(station, {
            limit: 1,
            parameter: ['pm25'],
          })
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

  if (!AllProviders.includes(provider)) {
    throw new Error(
      `universalFetch: Unrecognized universalId "${universalId}".`
    );
  }

  return await providerFetch(provider as AllProviders, station);
}

/**
 * Generate the correct expo message for our user.
 *
 * @param user - User in our DB.
 */
export async function expoMessageForUser(
  user: User & Document
): Promise<UserExpoMessage> {
  try {
    // Find the PM2.5 value at the user's last known station (universalId)
    const pm25 = await Promise.race([
      // If anything throws, we retry
      retry(
        async () => {
          assertUserNotifications(user);

          const { value } = await universalFetch(
            user.notifications.universalId
          );

          return value;
        },
        { retries: 5 }
      ),
      // Timeout after 5s, because the whole Now function only runs 10s
      new Promise<number>((_resolve, reject) =>
        setTimeout(() => reject(new Error('universalFetch timed out')), 5000)
      ),
    ]);

    return {
      userId: user._id,
      pushMessage: constructExpoMessage(user, pm25),
    };
  } catch (error) {
    throw new Error(`User ${user._id}: ${error.message}`);
  }
}
