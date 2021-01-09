/**
 * @ignore
 */ /** */

import debug from 'debug';

import { Aqi } from '../types';
import { Pollutant } from './pollutant';

const l = debug('shootismoke:convert');

/**
 * Round a number to closest 10^-{decimal}
 *
 * @param n - The float number to round
 * @param decimal - The number of decimals after the .
 */
export function round(n: number, decimals = 0): number {
	return Math.round(10 ** decimals * n) / 10 ** decimals;
}

type Piecewise = [number, number][];

/**
 * Piecewise breakpoints that define an AQI
 */
export type Breakpoints = Record<'aqi', Piecewise> &
	Partial<Record<Pollutant, Piecewise>>;

/**
 * From the breakpoints, we can derive the range (i.e. [min,max]) values of the
 * AQI.
 *
 * @param breakpoints - The breakpoints to calculate the range from
 */
function getRange(breakpoints: Piecewise): [number, number] {
	return [breakpoints[0][0], breakpoints[breakpoints.length - 1][1]];
}

/**
 * Convert an AQI to raw concentration using breakpoints
 *
 * @param value - AQI value to convert
 * @param breakpoints - Breakpoints defining the AQI
 */
function toRaw(
	aqiPiecewise: Piecewise,
	rawPiecewise: Piecewise,
	value: number
): number {
	// Find the segment in which the `aqi` is
	const segment = aqiPiecewise.findIndex(
		([aqiLow, aqiHigh]) => aqiLow <= value && value <= aqiHigh
	);

	if (segment === -1) {
		// For PM2.5 greater than 500, AQI is not officially defined, but since
		// such levels have been occurring throughout China in recent years, one of
		// two conventions is used. Either the AQI is defined as equal to PM2.5 (in
		// micrograms per cubic meter) or the AQI is simply set at 500.
		// We take the 1st convention here.
		// We also do the same for other pollutants
		return value;
	}

	const [aqiLow, aqiHigh] = aqiPiecewise[segment];
	const [rawLow, rawHigh] = rawPiecewise[segment];

	// Round to closest 0.1
	return round(
		((value - aqiLow) / (aqiHigh - aqiLow)) * (rawHigh - rawLow) + rawLow,
		1
	);
}

/**
 * Convert raw concentration to AQI using breakpoints
 *
 * @param raw - The raw value to convert
 * @param breakpoints - Breakpoints defining the AQI
 */
function fromRaw(
	aqiPiecewise: Piecewise,
	rawPiecewise: Piecewise,
	raw: number
): number {
	// Find the segment in which the `aqi` is
	const segment = rawPiecewise.findIndex(
		([rawLow, rawHigh]) => rawLow <= raw && raw <= rawHigh
	);

	if (segment === -1) {
		// For PM2.5 greater than 500, AQI is not officially defined, but since
		// such levels have been occurring throughout China in recent years, one of
		// two conventions is used. Either the AQI is defined as equal to PM2.5 (in
		// micrograms per cubic meter) or the AQI is simply set at 500.
		// We take the 1st convention here.
		// We also do the same for other pollutants
		return raw;
	}

	const [aqiLow, aqiHigh] = aqiPiecewise[segment];
	const [rawLow, rawHigh] = rawPiecewise[segment];

	// Round to closest integer
	return round(
		((aqiHigh - aqiLow) / (rawHigh - rawLow)) * (raw - rawLow) + aqiLow
	);
}

function assertTracked<P extends Pollutant>(
	aqiCode: string,
	pollutant: Pollutant,
	breakpoints: Breakpoints
): asserts breakpoints is Record<P | 'aqi', Piecewise> {
	if (!breakpoints.aqi) {
		l(`${aqiCode} does not have AQI breakpoints`);
		throw new Error(`${aqiCode} does not have AQI breakpoints`);
	}

	if (!breakpoints[pollutant]) {
		l(`${aqiCode} does not apply to pollutant ${pollutant}`);
		throw new Error(`${aqiCode} does not apply to pollutant ${pollutant}`);
	}
}

/**
 * Create an AQI from its breakpoints
 *
 * @param aqiCode - The code of the AQI
 * @param breakpoints - The breakpoints defining the AQI
 */
export function createAqiFromBreakpoints(
	aqiCode: string,
	breakpoints: Breakpoints
): Omit<Aqi, 'displayName'> {
	return {
		pollutants: Object.keys(breakpoints) as Pollutant[],
		fromRaw(pollutant: Pollutant, raw: number): number {
			assertTracked(aqiCode, pollutant, breakpoints);

			return fromRaw(breakpoints.aqi, breakpoints[pollutant], raw);
		},
		range: getRange(breakpoints.aqi),
		toRaw(pollutant: Pollutant, value: number): number {
			assertTracked(aqiCode, pollutant, breakpoints);

			return toRaw(breakpoints.aqi, breakpoints[pollutant], value);
		},
	};
}
