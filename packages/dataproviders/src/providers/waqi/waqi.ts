import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';

import { Provider } from '../../types';
import { fetchByGps } from './fetchBy';
import { normalize } from './normalize';
import { ByStation } from './validation';

/**
 * @see https://wind.waqi.info/
 */
export const waqi: Provider<ByStation, ByStation, unknown> = {
	fetchByGps,
	fetchByStation: () => TE.left(new Error('Unimplemented')),
	id: 'waqi',
	name: 'WAQI',
	normalizeByGps: normalize,
	normalizeByStation: () => E.left(new Error('Unimplemented')),
};
