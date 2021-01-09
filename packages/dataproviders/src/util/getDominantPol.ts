import { Pollutant } from '@shootismoke/convert';

import { Normalized } from '../types';

/**
 * From some normalized data, calculate the dominant pollutant, i.e. the
 * pollutant that has the highest AQI
 *
 * @param normalized - The normalized data
 */
export function getDominantPol(normalized: Normalized): Pollutant {
	return normalized.slice(-1).sort((a, b) => a.value - b.value)[0].parameter;
}
