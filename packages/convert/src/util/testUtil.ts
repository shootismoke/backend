import * as aqiCodes from '../aqi';
import { convert } from '../convert';
import { AqiCode } from '../types';
import { round } from './breakpoints';
import { getPollutantMeta, Pollutant } from './pollutant';

/**
 * Small utility function to step AQI/raw conversions for a pollutant
 */
export function testConvert(
	aqiCode: AqiCode,
	pollutant: Pollutant,
	aqi: number,
	raw: number
): void {
	it(`should convert ${pollutant}: ${
		aqiCodes[aqiCode].displayName
	} ${aqi} = ${raw}${getPollutantMeta(pollutant).preferredUnit}`, () => {
		// Sometimes, because of rounding, the values are not exact. We just want
		// them to be exact at +/-0.2
		expect(
			round(Math.abs(convert(pollutant, aqiCode, 'raw', aqi) - raw), 1)
		).toBeLessThanOrEqual(0.2);
		expect(
			round(Math.abs(convert(pollutant, 'raw', aqiCode, raw) - aqi), 1)
		).toBeLessThanOrEqual(0.2);
	});
}
