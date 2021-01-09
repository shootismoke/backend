import * as O from 'fp-ts/lib/Option';

import { getCountryCode } from './getCountryCode';

describe('getCountryCode', () => {
	it('should match exact country', () => {
		expect(getCountryCode('United States')).toEqual(O.some('US'));
	});

	it('should match lower case', () => {
		expect(getCountryCode('united states')).toEqual(O.some('US'));
	});

	it('should match multiple spacing', () => {
		expect(getCountryCode('united  states')).toEqual(O.some('US'));
	});

	it('should match dashed', () => {
		expect(getCountryCode('saudi-arabia')).toEqual(O.some('SA'));
	});

	it('should match included string', () => {
		expect(getCountryCode('United States Of America')).toEqual(
			O.some('US')
		);
	});
});
