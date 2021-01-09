import { Pollutant } from '@shootismoke/convert';
import * as TE from 'fp-ts/lib/TaskEither';

import { LatLng } from '../../types';
import { ACCURATE_RADIUS, fetchAndDecode } from '../../util';
import {
	OpenAQError,
	OpenAQLatest,
	OpenAQLatestCodec,
	OpenAQMeasurements,
	OpenAQMeasurementsCodec,
} from './validation';

const RESULT_LIMIT = 10;
const BASE_LATEST_URL = `https://api.openaq.org/v1/latest`;
const BASE_MEASUREMENTS_URL = `https://api.openaq.org/v1/measurements`;

/**
 * @see https://docs.openaq.org/#api-Latest
 */
export interface OpenAQOptions {
	/**
	 * Show results after a certain date. This acts on the utc timestamp of each
	 * measurement.
	 */
	dateFrom?: Date;
	/**
	 * Show results before a certain date. This acts on the utc timestamp of each measurement.
	 */
	dateTo?: Date;
	/**
	 * Include extra fields in the output in addition to default values.
	 */
	includeFields?: string[];
	/**
	 * Change the number of results returned, max is 10000.
	 * @default 10
	 */
	limit?: number;
	/**
	 * Limit to certain one or more parameters.
	 */
	parameter?: Pollutant[];
}

function additionalOptions(options: OpenAQOptions = {}): string {
	let query = '';

	// dateFrom
	if (options.dateFrom) {
		query += `&date_from=${options.dateFrom.toISOString()}`;
	}

	// dateTo
	if (options.dateTo) {
		query += `&date_to=${options.dateTo.toISOString()}`;
	}

	// includeFields
	query += `&include_fields=${(
		options.includeFields || [
			'attribution',
			'averagingPeriod',
			'mobile',
			'sourceName',
			'sourceType',
		]
	).join(',')}`;

	// limit
	query += `&limit=${options.limit || RESULT_LIMIT}`;

	// parameter
	query += (options.parameter || []).map((p) => `&parameter[]=${p}`).join('');

	return query;
}

/**
 * Handle error from OpenAQ response
 */
function onError(error: { response?: { data: OpenAQError } }): Error {
	// We had occasions from OpenAQ where the error had an empty response field
	if (error?.response?.data) {
		return new Error(
			`${error.response.data.statusCode} ${error.response.data.error}: ${error.response.data.message}`
		);
	}

	return new Error(JSON.stringify(error));
}

/**
 * Fetch the closest station to the user's current position
 *
 * @param gps - Latitude and longitude of the user's current position
 */
export function fetchByGps(
	gps: LatLng,
	options?: OpenAQOptions
): TE.TaskEither<Error, OpenAQLatest> {
	const { latitude, longitude } = gps;

	return fetchAndDecode(
		`${BASE_LATEST_URL}?coordinates=${latitude},${longitude}&radius=${ACCURATE_RADIUS}${additionalOptions(
			options
		)}`,
		OpenAQLatestCodec,
		{
			onError,
		}
	);
}

/**
 * Fetch data by station
 *
 * @param stationId - The station ID to search
 */
export function fetchByStation(
	stationId: string,
	options?: OpenAQOptions
): TE.TaskEither<Error, OpenAQMeasurements> {
	return fetchAndDecode(
		`${BASE_MEASUREMENTS_URL}?location=${stationId}${additionalOptions(
			options
		)}`,
		OpenAQMeasurementsCodec,
		{
			onError,
		}
	);
}
