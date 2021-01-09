import * as E from 'fp-ts/lib/Either';

import { promiseToTE } from './fp';

describe('promiseToTE', () => {
	it('should correctly convert to a TaskEither Right', async (done) => {
		const promise = (): Promise<number> => Promise.resolve(42);
		const e = await promiseToTE(promise)();

		expect(e).toEqual(E.right(42));
		done();
	});

	it('should correctly convert to a TaskEither Left (string)', async (done) => {
		const promise = (): Promise<number> => Promise.reject('foo');
		const e = await promiseToTE(promise)();

		expect(e).toEqual(E.left(new Error('foo')));
		done();
	});

	it('should correctly convert to a TaskEither Left (Error)', async (done) => {
		const promise = (): Promise<number> => Promise.reject(new Error('foo'));
		const e = await promiseToTE(promise)();

		expect(e).toEqual(E.left(new Error('foo')));
		done();
	});
});
