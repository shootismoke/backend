/**
 * Parts per billion.
 */
export const ppb = 'ppb';
/**
 * Parts per million.
 */
export const ppm = 'ppm';
/**
 * Microgram per cubic meter.
 */
export const ugm3 = 'µg/m³';

/**
 * Array of pollutant concentration units.
 */
export const AllUnits = [ppb, ppm, ugm3];

/**
 * Pollutant concentration units.
 */
export type Unit = typeof ppb | typeof ppm | typeof ugm3;

/**
 * All the pollutants tracked by @shootismoke.
 */
export type Pollutant =
	| 'bc'
	| 'ch4'
	| 'co'
	| 'c6h6'
	| 'ox'
	| 'nh3'
	| 'nmhc'
	| 'no'
	| 'nox'
	| 'no2'
	| 'o3'
	| 'pm10'
	| 'pm25'
	| 'so2'
	| 'trs';

/**
 * Metadata for each pollutant.
 */
export interface PollutantMeta {
	id: Pollutant;
	name: string;
	description: string;
	preferredUnit: Unit;
}

/**
 * All the pollutants tracked by @shootismoke.
 *
 * @ignore
 */
const Pollutants: Record<Pollutant, PollutantMeta> = {
	bc: {
		id: 'bc',
		name: 'BC',
		description: 'Black carbon',
		preferredUnit: ugm3,
	},
	ch4: {
		id: 'ch4',
		name: 'CH4',
		description: 'Methane',
		preferredUnit: ppb,
	},
	co: {
		id: 'co',
		name: 'CO',
		description: 'Carbon monoxide',
		preferredUnit: ppb,
	},
	c6h6: {
		id: 'c6h6',
		name: 'C6H6',
		description: 'Benzene',
		preferredUnit: ugm3,
	},
	ox: {
		id: 'ox',
		name: 'Ox',
		description: 'Photochemical oxidants',
		preferredUnit: ppb,
	},
	o3: {
		id: 'o3',
		name: 'O3',
		description: 'Ozone',
		preferredUnit: ppb,
	},
	nh3: {
		id: 'nh3',
		name: 'NH3',
		description: 'Ammonia',
		preferredUnit: ppb,
	},
	nmhc: {
		id: 'nmhc',
		name: 'NMHC',
		description: 'Non-methane hydrocarbons',
		preferredUnit: ppb,
	},
	no: {
		id: 'no',
		name: 'NO',
		description: 'Nitrogen monoxide',
		preferredUnit: ppb,
	},
	nox: {
		id: 'nox',
		name: 'NOx',
		description: 'Nitrogen oxides',
		preferredUnit: ppb,
	},
	no2: {
		id: 'no2',
		name: 'NO2',
		description: 'Nitrogen dioxide',
		preferredUnit: ppb,
	},
	pm25: {
		id: 'pm25',
		name: 'PM25',
		description: 'Fine particulate matter (<2.5µm)',
		preferredUnit: ugm3,
	},
	pm10: {
		id: 'pm10',
		name: 'PM10',
		description: 'Inhalable particulate matter (<10µm)',
		preferredUnit: ugm3,
	},
	so2: {
		id: 'so2',
		name: 'SO2',
		description: 'Sulfur dioxide',
		preferredUnit: ppb,
	},
	trs: {
		id: 'trs',
		name: 'TRS',
		description: 'Total reduced sulfur',
		preferredUnit: ugm3,
	},
};

/**
 * Array of all pollutants tracked by @shootismoke.
 */
export const AllPollutants = Object.keys(Pollutants) as Pollutant[];

/**
 * Get metadata (code, name, description, unit) for a pollutant.
 *
 * @param pollutant - The pollutant to get the metadata from.
 */
export function getPollutantMeta(pollutant: Pollutant): PollutantMeta {
	return Pollutants[pollutant];
}

/**
 * Check if the input pollutant is a recognized pollutant which we can convert
 * AQI to/from raw concentrations.
 *
 * @param pollutant - The pollutant to test.
 */
export function isPollutant(pollutant: string): pollutant is Pollutant {
	return AllPollutants.includes(pollutant as Pollutant);
}
