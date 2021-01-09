import * as E from 'fp-ts/lib/Either';

import { ByStation } from './validation';
import { waqi } from './waqi';

describe('waqi', () => {
	describe('by station', () => {
		it('should throw on fetchByStation', async () => {
			expect(await waqi.fetchByStation('foo')()).toEqual(
				E.left(new Error('Unimplemented'))
			);
			expect(waqi.normalizeByStation({} as ByStation)).toEqual(
				E.left(new Error('Unimplemented'))
			);
		});
	});
});
