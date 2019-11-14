import { aqiToRaw, getUnit, isPollutant, rawToAqi } from '@shootismoke/aqi/src';

import { pm25ToCigarettes } from '../secretSauce';
import { NormalizedByGps } from '../types';
import { WaqiStation } from './validation';

/**
 * Normalize aqicn byGps data
 *
 * @param data - The data to normalize
 */
export function waqiNormalizeByGps({
  d: [data]
}: WaqiStation): NormalizedByGps {
  const universalId = `waqi|${data.x}`;

  if (!isPollutant(data.pol)) {
    throw new Error(
      `Cannot normalizeByGps station ${universalId}: ${JSON.stringify(data)}`
    );
  }

  const aqiUS = +data.v;
  // Calculate pm25 raw value to get cigarettes value
  const raw = aqiToRaw('pm25', aqiUS, 'US');
  const aqiCN = rawToAqi('pm25', raw, 'CN');

  return {
    closestStation: {
      gps: { latitude: data.geo[0], longitude: data.geo[1] },
      name: data.nlo,
      provider: 'waqi',
      universalId: `waqi|${data.x}`
    },
    dailyCigarettes: data.pol === 'pm25' ? pm25ToCigarettes(raw) : undefined,
    pollutants: {
      // FIXME aqiCN, raw, and unit values are Wrong!!!
      // https://github.com/shootismoke/backend/issues/28
      [data.pol]: { aqiCN, aqiUS, raw, unit: getUnit(data.pol) }
    },
    updatedAt: data.t
  };
}
