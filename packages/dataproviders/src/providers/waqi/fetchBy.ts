import * as TE from 'fp-ts/lib/TaskEither';

import { LatLng } from '../../types';
import { fetchAndDecode } from '../../util';
import { ByStation, ByStationCodec } from './validation';

/**
 * Fetch the closest station to the user's current position.
 *
 * @param gps - Latitude and longitude of the user's current position
 */
export function fetchByGps(gps: LatLng): TE.TaskEither<Error, ByStation> {
	const { latitude, longitude } = gps;

	return fetchAndDecode(
		`https://wind.waqi.info/mapq/nearest?geo=1/${latitude}/${longitude}`,
		ByStationCodec
	);
}
