import * as aqiCodes from './aqi';
import { AqiCode } from './types';
import { Pollutant } from './util';

/**
 * For any pollutant, convert an AQI to its raw concentration, or vice versa,
 * or convert an AQI to another AQI
 *
 * @param pollutant - The pollutant to convert
 * @param from - The type to convert from (either raw, or an AQI)
 * @param to - The type to convert to (either raw, or an AQI)
 * @param value - The value to convert
 */
export function convert<
	From extends AqiCode | 'raw',
	To extends AqiCode | 'raw'
>(pollutant: Pollutant, from: From, to: To, value: number): number {
	if (from === 'raw' && to === 'raw') {
		return value;
	}

	// Convert raw to AQI
	if (from === 'raw') {
		return aqiCodes[to as AqiCode].fromRaw(pollutant, value);
	}

	// Convert AQI to raw
	if (to === 'raw') {
		return aqiCodes[from as AqiCode].toRaw(pollutant, value);
	}

	// Convert AQI to AQI
	const raw = aqiCodes[from as AqiCode].toRaw(pollutant, value);
	return aqiCodes[to as AqiCode].fromRaw(pollutant, raw);
}
