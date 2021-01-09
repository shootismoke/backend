// Sh**t! I Smoke
// Copyright (C) 2018-2020  Marcelo S. Coelho, Amaury Martiny

// Sh**t! I Smoke is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Sh**t! I Smoke is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Sh**t! I Smoke.  If not, see <http://www.gnu.org/licenses/>.

import { Normalized, OpenAQFormat } from '@shootismoke/dataproviders';

/**
 * Api is basically the normalized data from '@shootismoke/dataproviders',
 * where we make sure to add cigarette conversion. An API is returned only when
 * there is PM2.5 data (even inacurrate.)
 */
export interface Api {
	/**
	 * All normalized data returned by the provider.
	 */
	normalized: Normalized;
	/**
	 * Raw data corresponding to the PM2.5 pollutant.
	 */
	pm25: OpenAQFormat;
	/**
	 * Data used by shootismoke frontends.
	 */
	shootismoke: {
		/**
		 * The amount of cigarettes converted from the PM2.5 level.
		 */
		dailyCigarettes: number;
		/**
		 * The distance to the closest station where PM2.5 level can be
		 * measured.
		 */
		distanceToStation: number;
		/**
		 * Whether the pm25 level is accuruate. This happens when the station
		 * from which the measurement took place is not too far.
		 */
		isAccurate: boolean;
	};
}

/**
 * Round a number to 1 decimal. Useful for showing cigarettes on the home page.
 *
 * @param n - The number to round;
 */
export function round(n: number): number {
	return Math.round(n * 10) / 10;
}
