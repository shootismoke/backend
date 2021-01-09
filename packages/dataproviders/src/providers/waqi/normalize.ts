import {
	convert,
	getPollutantMeta,
	isPollutant,
	Pollutant,
} from '@shootismoke/convert';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';

import { Normalized } from '../../types';
import { getCountryCode, providerError } from '../../util';
import { ByStation } from './validation';

/**
 * Normalize aqicn byGps data
 *
 * @param data - The data to normalize
 */
export function normalize({
	d: [data],
}: ByStation): E.Either<Error, Normalized> {
	const stationId = `waqi|${data.x}`;

	if (!isPollutant(data.pol)) {
		return E.left(
			providerError(
				'waqi',
				`Cannot normalize station ${stationId}, unrecognized pollutant ${
					data.pol
				}: ${JSON.stringify(data)}`
			)
		);
	}

	const aqiUS = +data.v;
	// Calculate pm25 raw value to get cigarettes value
	const raw = convert('pm25', 'usaEpa', 'raw', aqiUS);

	if (!data.u.includes('/')) {
		return E.left(
			providerError(
				'waqi',
				`Got invalid country/city info: ${JSON.stringify(data.u)}`
			)
		);
	}
	const [countryRaw, city] = data.u.split('/');

	// Get UTC time
	const utc = new Date(+data.t * 1000).toISOString();

	return pipe(
		getCountryCode(countryRaw),
		E.fromOption(() =>
			providerError('waqi', `Cannot get code from country ${countryRaw}`)
		),
		E.map((country) => [
			{
				attribution: [{ name: data.nlo }],
				averagingPeriod: {
					unit: 'day',
					value: 1,
				},
				coordinates: {
					latitude: data.geo[0],
					longitude: data.geo[1],
				},
				country,
				city,
				date: {
					local: utc, // FIXME How should we get local time from UTC time?
					utc,
				},
				location: `waqi|${data.x}`,
				mobile: false,
				parameter: data.pol as Pollutant,
				sourceName: 'waqi',
				sourceType: 'other',
				unit: getPollutantMeta(data.pol as Pollutant).preferredUnit,
				value: raw,
			},
		])
	);
}
