import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';

import { OpenAQFormat } from './util';

/**
 * Latitude and longitude object
 */
export interface LatLng {
	latitude: number;
	longitude: number;
}

interface ArrayOneOrMore<T> extends Array<T> {
	0: T;
}

/**
 * Normalized response from all data providers. We guarantee that normalized
 * results have at least one element, in the openaq-data-format
 */
export type Normalized = ArrayOneOrMore<OpenAQFormat>;

/**
 * An interface representing an air quality data provider (fp-ts version)
 */
export interface Provider<DataByGps, DataByStation, Options> {
	fetchByGps(gps: LatLng, options?: Options): TE.TaskEither<Error, DataByGps>;
	fetchByStation(
		stationId: string,
		options?: Options
	): TE.TaskEither<Error, DataByStation>;
	id: string;
	name: string;
	normalizeByGps(d: DataByGps): E.Either<Error, Normalized>;
	normalizeByStation(d: DataByStation): E.Either<Error, Normalized>;
}

/**
 * An interface representing an air quality data provider (Promise version)
 */
export interface ProviderPromise<DataByGps, DataByStation, Options> {
	fetchByGps(gps: LatLng, options?: Options): Promise<DataByGps>;
	fetchByStation(
		stationId: string,
		options?: Options
	): Promise<DataByStation>;
	id: string;
	name: string;
	normalizeByGps(d: DataByGps): Normalized;
	normalizeByStation(d: DataByStation): Normalized;
}
