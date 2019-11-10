import { aqiToRaw } from './aqiToRaw';
import { rawToAqi } from './rawToAqi';
import { AqiType, Pollutant } from './types';

function testConversion(
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

describe('Conversion `aqiToRaw` & `rawToAqi`', () => {
  describe('pm25', () => {
    testConversion('pm25', 'US', 25, 6);
    testConversion('pm25', 'US', 39, 9.35);
    testConversion('pm25', 'US', 57, 15);
    testConversion('pm25', 'US', 75, 23.5);
    testConversion('pm25', 'US', 125, 45.2);
    testConversion('pm25', 'US', 175, 102);
    testConversion('pm25', 'US', 250, 199.9);
    testConversion('pm25', 'US', 285, 235.4);
    testConversion('pm25', 'US', 350, 299.9);
    testConversion('pm25', 'US', 450, 424.5);
    testConversion('pm25', 'US', 550, 550);
  });
});
