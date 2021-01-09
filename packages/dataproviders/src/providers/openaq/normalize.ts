import * as E from 'fp-ts/lib/Either';

import { Normalized } from '../../types';
import { providerError } from '../../util';
import { OpenAQMeasurements, OpenAQLatest } from './validation';

/**
 * Normalize aqicn byGps data
 *
 * @param data - The data to normalize
 */
export function normalizeByGps(
	data: OpenAQLatest
): E.Either<Error, Normalized> {
	const { results } = data;

	if (!results.length) {
		return E.left(
			providerError('openaq', 'Cannot normalize, got 0 result')
		);
	}

	return E.right(
		(results
			.map((result) =>
				result.measurements.map((m) => ({
					...m,
					city: result.city,
					coordinates: result.coordinates,
					country: result.country,
					date: {
						local: m.lastUpdated,
						utc: m.lastUpdated,
					},
					location: `openaq|${result.location}`,
				}))
			)
			.flat() as unknown) as Normalized
	);
}

/**
 * Normalize aqicn byGps data
 *
 * @param data - The data to normalize
 */
export function normalizeByStation(
	data: OpenAQMeasurements
): E.Either<Error, Normalized> {
	const { results } = data;

	if (!results.length) {
		return E.left(
			providerError('openaq', 'Cannot normalize, got 0 result')
		);
	}

	return E.right(
		results.map((result) => ({
			...result,
			location: `openaq|${result.location}`,
		})) as Normalized
	);
}
