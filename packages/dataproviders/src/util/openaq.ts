import * as t from 'io-ts';

/**
 * @ignore
 */
export const attributionsCodec = t.array(
	t.intersection([
		t.type({
			name: t.string,
		}),
		t.partial({
			url: t.string,
		}),
	])
);

/**
 * @ignore
 */
export const latLngCodec = t.union([
	t.type({
		latitude: t.number,
		longitude: t.number,
	}),
	t.undefined,
]);

/**
 * @ignore
 */
export const pollutantCodec = t.union([
	// FIXME
	// Instead of rewriting these, can we use the types and array defined in
	// import { AllPollutants, Pollutant } from '@shootismoke/convert';
	t.literal('bc'),
	t.literal('ch4'),
	t.literal('co'),
	t.literal('c6h6'),
	t.literal('ox'),
	t.literal('nh3'),
	t.literal('nmhc'),
	t.literal('no'),
	t.literal('nox'),
	t.literal('no2'),
	t.literal('o3'),
	t.literal('pm10'),
	t.literal('pm25'),
	t.literal('so2'),
	t.literal('trs'),
]);

/**
 * @ignore
 */
export const unitCodec = t.union([
	t.literal('ppb'),
	t.literal('ppm'),
	t.literal('µg/m³'),
]);

/**
 * @ignore
 */
export const sourceTypeCodec = t.union([
	t.literal('government'),
	t.literal('research'),
	t.literal('other'),
]);

// Required fields for OpenAQ data format
const OpenAQCodecRequired = t.type({
	city: t.string,
	coordinates: latLngCodec,
	country: t.string,
	date: t.type({
		local: t.string,
		utc: t.string,
	}),
	location: t.string,
	parameter: pollutantCodec,
	sourceName: t.string,
	value: t.number,
	unit: unitCodec,
});

// Optional fields for OpenAQ data format
export const OpenAQCodecOptional = t.partial({
	attribution: attributionsCodec,
	averagingPeriod: t.type({
		unit: t.string,
		value: t.number,
	}),
	mobile: t.boolean,
	sourceType: sourceTypeCodec,
});

/**
 * An io-ts codec to validate the OpenAQ data format.
 *
 * @see https://github.com/openaq/openaq-data-format
 */
export const OpenAQCodec = t.intersection([
	OpenAQCodecRequired,
	OpenAQCodecOptional,
]);

/**
 * A TypeScript type to represent the OpenAQ data format.
 *
 * @see https://github.com/openaq/openaq-data-format
 */
export type OpenAQFormat = t.TypeOf<typeof OpenAQCodec>;
