import { Unit } from '@shootismoke/aqi/src/util';
import { Provider } from '@shootismoke/graphql/src/types';

/**
 * Latitude and longitude object
 */
export interface LatLng {
  latitude: number;
  longitude: number;
}

/**
 * The concentration of a pollutant, in
 */
export interface PollutantValue {
  aqiCN: number;
  aqiUS: number;
  raw: number;
  unit: Unit;
}

// FIXME Use: import { Station } from '@shootismoke/graphql/src/types';
interface Station {
  gps: LatLng;
  name: string;
  provider: Provider;
  universalId: string;
}

/**
 * Normalized response from all data providers
 */
export interface NormalizedByGps {
  closestStation: Station;
  dailyCigarettes?: number;
  pollutants: Partial<{
    pm25: PollutantValue;
    // FIXME Use exact pollutants list
    [index: string]: PollutantValue;
  }>;
  updatedAt: number;
}
