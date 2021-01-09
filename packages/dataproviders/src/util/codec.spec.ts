import * as E from 'fp-ts/lib/Either';

import { ByStationCodec } from '../providers/aqicn/validation';
import { decodeWith } from './codec';

describe('codec decode', () => {
	it('should return left when decode fails', async (done) => {
		expect(await decodeWith(ByStationCodec)('foo')()).toEqual(
			E.left(
				new Error(
					'Invalid value "foo" supplied to : { status: "ok" | "error" | "nope", data: ({ attributions: Array<({ name: string } & Partial<{ url: string }>)>, city: { geo: ([(string | number), (string | number)] | null), name: (string | undefined), url: (string | undefined) }, dominentpol: (string | undefined), iaqi: ({ [K in string]: { v: number } } | undefined), idx: number, time: { s: (string | undefined), tz: (string | undefined), v: number } } | string | undefined), msg: (string | undefined) }'
				)
			)
		);
		done();
	});
});
