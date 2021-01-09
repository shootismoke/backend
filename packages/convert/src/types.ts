import * as aqiCodes from './aqi';
import { Pollutant } from './util';

/**
 * An interface to represent an AQI
 */
export interface Aqi {
	displayName: string;
	fromRaw(pollutant: Pollutant, raw: number): number;
	pollutants: Pollutant[];
	range: [number, number];
	toRaw(pollutant: Pollutant, value: number): number;
}

/**
 * List of AQI codes
 */
export type AqiCode = keyof typeof aqiCodes;
