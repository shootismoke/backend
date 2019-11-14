import { aqiToRaw } from '../aqiToRaw';
import { rawToAqi } from '../rawToAqi';
import { AqiType } from '../types';
import { Pollutant } from '../util';

/**
 * Small utility function to step AQI/raw conversions for a pollutant
 */
export function testConversion(
  pollutant: Pollutant,
  aqiType: AqiType,
  aqi: number,
  raw: number
): void {
  it(`should convert ${aqiType} AQI ${aqi} to ${raw}ug/m3`, () => {
    // Sometimes, because of rounding, the values are not exact. We just want
    // them to be exact at +/-0.2
    expect(
      Math.abs(aqiToRaw(pollutant, aqi, aqiType) - raw)
    ).toBeLessThanOrEqual(0.2);
    expect(
      Math.abs(rawToAqi(pollutant, raw, aqiType) - aqi)
    ).toBeLessThanOrEqual(0.2);
  });
}
