import { Pollutant } from '../types';

export const ppm = 'ppm';
export const ugm3 = 'µg/m³';

export type Unit = typeof ppm | typeof ugm3;

const POLLUTANT_UNITS: Record<Pollutant, Unit> = {
  pm25: 'µg/m³'
};

export function getUnit(pollutant: Pollutant): Unit {
  return POLLUTANT_UNITS[pollutant];
}
