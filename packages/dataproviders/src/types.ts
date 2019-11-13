import { Unit } from '@shootismoke/aqi/src/util';
import { Station } from '@shootismoke/graphql/src/types';

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

/**
 * Normalized response from all data providers
 */
export interface NormalizedByGps {
  pollutants: Partial<{
    pm25: PollutantValue;
    // FIXME Use exact pollutants list
    [index: string]: PollutantValue;
  }>;
  stations: Omit<Omit<Station, 'universalId'>, '_id'>[];
}
