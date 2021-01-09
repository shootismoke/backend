import { Provider } from '../../types';
import { fetchByGps, fetchByStation, OpenAQOptions } from './fetchBy';
import { normalizeByGps, normalizeByStation } from './normalize';
import { OpenAQMeasurements, OpenAQLatest } from './validation';

export const openaq: Provider<
	OpenAQLatest,
	OpenAQMeasurements,
	OpenAQOptions
> = {
	fetchByGps,
	fetchByStation,
	id: 'openaq',
	name: 'Open AQ',
	normalizeByGps,
	normalizeByStation,
};
