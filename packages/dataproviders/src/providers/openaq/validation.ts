import * as t from 'io-ts';

import {
	latLngCodec,
	unitCodec,
	pollutantCodec,
	OpenAQCodec,
	OpenAQCodecOptional,
} from '../../util';

const OpenAQMetaCodec = t.type({
	found: t.number,
	license: t.string,
	limit: t.number,
	name: t.string,
	page: t.number,
	website: t.string,
});

/**
 * Codec for the /v1/latest endpoint.
 *
 * @see https://docs.openaq.org/#api-Latest
 */
export const OpenAQLatestCodec = t.type({
	meta: OpenAQMetaCodec,
	results: t.array(
		t.type({
			city: t.string,
			coordinates: latLngCodec,
			country: t.string,
			location: t.string,
			measurements: t.array(
				t.intersection([
					t.type({
						lastUpdated: t.string,
						parameter: pollutantCodec,
						sourceName: t.string,
						value: t.number,
						unit: unitCodec,
					}),
					OpenAQCodecOptional,
				])
			),
		})
	),
});

export type OpenAQLatest = t.TypeOf<typeof OpenAQLatestCodec>;

/**
 * Codec for the /v1/measurements endpoint.
 *
 * @see https://docs.openaq.org/#api-Measurements
 */
export const OpenAQMeasurementsCodec = t.type({
	meta: OpenAQMetaCodec,
	results: t.array(OpenAQCodec),
});

/**
 * @see https://docs.openaq.org/#api-Measurements
 */
export type OpenAQMeasurements = t.TypeOf<typeof OpenAQMeasurementsCodec>;

const OpenAQErrorCodec = t.type({
	error: t.string,
	message: t.string,
	statusCode: t.number,
	validation: t.type({
		keys: t.record(t.number, t.string),
		source: t.string,
	}),
});

export type OpenAQError = t.TypeOf<typeof OpenAQErrorCodec>;
