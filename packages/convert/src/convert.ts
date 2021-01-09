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
export function convert(
	pollutant: Pollutant,
	from: AqiCode | 'ugm3',
	to: AqiCode | 'ugm3',
	value: number
): number {
	if (from === to) {
		return value;
	}

	// Convert ugm3 to AQI
	if (from === 'ugm3') {
		return aqiCodes[to as AqiCode].fromUgm3(pollutant, value);
	}

	// Convert AQI to ugm3
	if (to === 'ugm3') {
		return aqiCodes[from].toUgm3(pollutant, value);
	}

	// Convert AQI to AQI
	const ugm3 = aqiCodes[from].toUgm3(pollutant, value);
	return aqiCodes[to].fromUgm3(pollutant, ugm3);
}
