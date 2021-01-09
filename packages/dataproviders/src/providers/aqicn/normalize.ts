import {
	convert,
	getPollutantMeta,
	Pollutant,
	usaEpa,
} from '@shootismoke/convert';
import { format, utcToZonedTime } from 'date-fns-tz';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';

import { Normalized } from '../../types';
import { getCountryCode, providerError } from '../../util';
import sanitized from './sanitized.json';
import { ByStation } from './validation';

/**
 * Sanitize the country we get here from aqicn. For example, for China, the
 * string after 'https://aqicn.org/city/' is not 'china', but directly the
 * Chinese privince, e.g. 'jiangsu'. In this case, we map directly to China.
 * See sanitized.json for some other sanitazations, these are empirical, so
 * we add them as we discover them.
 */
function sanitizeCountry(input: string): string {
	if (sanitized[input.toLowerCase() as keyof typeof sanitized]) {
		return sanitized[input.toLowerCase() as keyof typeof sanitized];
	}

	return input;

	// FIXME The above castings seems hacky, should we just use an external
	// service to get country from lat/lng?
}

/**
 * Normalize aqicn byGps data
 *
 * @param data - The data to normalize
 */
export function normalize(data: ByStation): E.Either<Error, Normalized> {
	const stationId = `aqicn|${data.idx}`;

	// Sometimes we don't get geo
	if (!data.city.geo) {
		return E.left(
			providerError(
				'aqicn',
				`Cannot normalize station ${stationId}, no city: ${JSON.stringify(
					data
				)}`
			)
		);
	}

	// Since AqiCN uses useEpa as AQI for the pollutants, we can only
	// normalize data for those pollutants
	const pollutants = Object.entries(data.iaqi || {}).filter(([pol]) =>
		usaEpa.pollutants.includes(pol as Pollutant)
	);
	if (!pollutants.length) {
		return E.left(
			providerError(
				'aqicn',
				`Cannot normalize station ${stationId}, no pollutants currently tracked: ${JSON.stringify(
					data
				)}`
			)
		);
	}
	// We now need to get the country from AQICN response. The only place I found
	// is city.url...
	// Example: https://aqicn.org/city/france/lorraine/thionville-nord/garche/
	const AQICN_DOMAIN = 'aqicn.org/city/';
	if (!data.city.url || !data.city.url.includes(AQICN_DOMAIN)) {
		return E.left(
			providerError(
				'aqicn',
				`Cannot extract country, got city.url: ${
					data.city.url as string
				}`
			)
		);
	}
	const countryUgm3 = sanitizeCountry(
		data.city.url.split(AQICN_DOMAIN)[1].split('/')[0]
	);

	// Get the timezoned date
	const utc = new Date(+data.time.v * 1000).toISOString();
	const local = format(
		utcToZonedTime(+data.time.v * 1000, data.time.tz || 'Z'),
		"yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
	);

	return pipe(
		getCountryCode(countryUgm3),
		E.fromOption(() =>
			providerError(
				'aqicn',
				`Cannot get code from country ${countryUgm3}`
			)
		),
		E.map(
			(country) =>
				pollutants.map(([pol, { v }]) => {
					const pollutant = pol as Pollutant;

					if (!data.city.geo) {
						throw new Error(
							'We returned TE.left if data.city.geo was not defined. qed.'
						);
					}

					return {
						attribution: data.attributions,
						averagingPeriod: {
							unit: 'day',
							value: 1,
						},
						city: data.city.name || 'Unknown city', // FIXME Don't put "unknown" here
						coordinates: {
							latitude: +data.city.geo[0],
							longitude: +data.city.geo[1],
						},
						country,
						date: { local, utc },
						location: stationId,
						mobile: false,
						parameter: pollutant,
						sourceName: 'aqicn',
						sourceType: 'other',
						value: convert(pollutant, 'usaEpa', 'ugm3', v),
						unit: getPollutantMeta(pollutant).preferredUnit,
					};
				}) as Normalized
		)
	);
}
