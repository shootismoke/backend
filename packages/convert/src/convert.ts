import * as aqiCodes from './aqi';
import { AqiCode } from './types';
import { Pollutant } from './util';

/**
 * For any pollutant, convert an AQI to its ugm3 concentration, or vice versa,
 * or convert an AQI to another AQI
 *
 * @param pollutant - The pollutant to convert
 * @param from - The type to convert from (either ugm3, or an AQI)
 * @param to - The type to convert to (either ugm3, or an AQI)
 * @param value - The value to convert
 */
export function convert<
	From extends AqiCode | 'ugm3',
	To extends AqiCode | 'ugm3'
>(pollutant: Pollutant, from: From, to: To, value: number): number {
	if (from === 'ugm3' && to === 'ugm3') {
		return value;
	}

	// Convert ugm3 to AQI
	if (from === 'ugm3') {
		return aqiCodes[to as AqiCode].fromUgm3(pollutant, value);
	}

	// Convert AQI to ugm3
	if (to === 'ugm3') {
		return aqiCodes[from as AqiCode].toUgm3(pollutant, value);
	}

	// Convert AQI to AQI
	const ugm3 = aqiCodes[from as AqiCode].toUgm3(pollutant, value);
	return aqiCodes[to as AqiCode].fromUgm3(pollutant, ugm3);
}
