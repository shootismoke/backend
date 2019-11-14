import { Pollutant } from './pollutant';

export const ppb = 'ppb';
export const ppm = 'ppm';
export const ugm3 = 'µg/m³';

export type Unit = typeof ppb | typeof ppm | typeof ugm3;

const POLLUTANT_UNITS: Record<Pollutant, Unit> = {
  co: 'ppm',
  no2: 'ppb',
  o3: 'ppm',
  pm10: 'µg/m³',
  pm25: 'µg/m³',
  so2: 'ppb'
};

export function getUnit(pollutant: Pollutant): Unit {
  return POLLUTANT_UNITS[pollutant];
}
