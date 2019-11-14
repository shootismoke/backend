import * as breakpoints from './breakpoints';
import { AqiType } from './types';
import { Pollutant, roundTo1Decimal } from './util';

/**
 * Converts a pollutant AQI into the raw PM25 level, in ug/m3, following the
 * EPAstandard, using {@link breakpointsUS}
 *
 * @param pollutant - The pollutant to convert
 * @param aqi - The AQI value
 * @param aqiType - Whether the AQI is measured with the US standard or the
 * Chinese standard
 * @see https://www3.epa.gov/airnow/aqi-technical-assistance-document-sept2018.pdf
 */
export function aqiToRaw(
  pollutant: Pollutant,
  aqi: number,
  aqiType: AqiType = 'US'
): number {
  if (pollutant !== 'pm25') {
    throw new Error(
      'Not implemeted. See https://github.com/shootismoke/backend/issues/28.'
    );
  }

  // Find the segment in which the `aqi` is
  const segment = breakpoints[pollutant][aqiType].find(
    ([[aqiLow, aqiHigh]]) => aqiLow <= aqi && aqi <= aqiHigh
  );

  if (!segment) {
    // For PM2.5 greater than 500, AQI is not officially defined, but since
    // such levels have been occurring throughout China in recent years, one of
    // two conventions is used. Either the AQI is defined as equal to PM2.5 (in
    // micrograms per cubic meter) or the AQI is simply set at 500.
    // We take the 1st convention here.
    return aqi;
  }

  const [[aqiLow, aqiHigh], [rawLow, rawHigh]] = segment;
  // Use 1 decimal place as per the pdf
  return roundTo1Decimal(
    ((aqi - aqiLow) / (aqiHigh - aqiLow)) * (rawHigh - rawLow) + rawLow
  );
}
