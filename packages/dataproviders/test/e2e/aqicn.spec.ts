import * as E from 'fp-ts/lib/Either';

import { aqicn } from '../../src/providers/aqicn';
import { testProviderE2E, testTE } from '../../src/util';

const options = {
	token: process.env.AQICN_TOKEN as string,
};

describe('aqicn e2e', () => {
	beforeAll(() => jest.setTimeout(30000));

	it('should return an error with an unknown station', async (done) => {
		expect(await aqicn.fetchByStation('foo', options)()).toEqual(
			E.left(new Error('Unknown station'))
		);

		done();
	});

	describe('fetchByGps sanitize.json mapping', () => {
		it(`should fetch paris by gps with sanitize.json mapping`, (done) =>
			testTE(
				aqicn.fetchByGps(
					{ latitude: 48.8546, longitude: 2.34771 },
					options
				),
				(d) => aqicn.normalizeByGps(d),
				done
			));
	});

	testProviderE2E(aqicn, { options });

	afterAll(() => jest.setTimeout(5000));
});
