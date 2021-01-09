import {
	aqicn as aqicnFp,
	openaq as openaqFp,
	waqi as waqiFp,
} from './providers';
import { LatLng, Normalized, Provider, ProviderPromise } from './types';
import { eitherToFunction, teToPromise } from './util';

function promisifyProvider<DataByGps, DataByStation, Options>(
	provider: Provider<DataByGps, DataByStation, Options>
): ProviderPromise<DataByGps, DataByStation, Options> {
	return {
		...provider,
		fetchByGps(gps: LatLng, options?: Options): Promise<DataByGps> {
			return teToPromise(provider.fetchByGps(gps, options));
		},
		fetchByStation(
			stationId: string,
			options?: Options
		): Promise<DataByStation> {
			return teToPromise(provider.fetchByStation(stationId, options));
		},
		normalizeByGps(d: DataByGps): Normalized {
			return eitherToFunction(provider.normalizeByGps(d));
		},
		normalizeByStation(d: DataByStation): Normalized {
			return eitherToFunction(provider.normalizeByStation(d));
		},
	};
}

export const aqicn = promisifyProvider(aqicnFp);
export const openaq = promisifyProvider(openaqFp);
export const waqi = promisifyProvider(waqiFp);
