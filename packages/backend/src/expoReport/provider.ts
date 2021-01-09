import { AllProviders } from '@shootismoke/dataproviders';
import { aqicn, openaq, waqi } from '@shootismoke/dataproviders/lib/promise';
import { IUser } from '@shootismoke/types';
import { Api, createApi } from '@shootismoke/ui';
import retry from 'async-retry';

import { constructExpoMessage, UserExpoMessage } from './expo';

type AllProviders = 'aqicn' | 'openaq' | 'waqi';

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
): Promise<Api> {
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

	// Gps coordinates are irrelevant for expo report.
	return createApi({ latitude: 0, longitude: 0 }, normalized);
}

/**
 * Fetch data from correct provider, based on universalId.
 *
 * @param universalId - The universalId of the station
 */
async function universalFetch(universalId: string): Promise<Api> {
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
	user: IUser
): Promise<UserExpoMessage> {
	try {
		// Find the PM2.5 value at the user's last known station (universalId)
		const pm25 = await Promise.race([
			// If anything throws, we retry
			retry(
				async () => {
					const {
						pm25: { value },
					} = await universalFetch(user.lastStationId);

					return value;
				},
				{ retries: 5 }
			),
			// Timeout after 9s, because the whole Vercel Now function only runs 10s
			new Promise<number>((_resolve, reject) =>
				setTimeout(
					() => reject(new Error('universalFetch timed out')),
					9000
				)
			),
		]);

		return {
			userId: user._id,
			pushMessage: constructExpoMessage(user, pm25),
		};
	} catch (error) {
		throw new Error(`User ${user._id}: ${(error as Error).message}`);
	}
}
