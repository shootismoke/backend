/**
 * @ignore
 */ /** */

import * as E from 'fp-ts/lib/Either';
import { Lazy } from 'fp-ts/lib/function';
import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';

/**
 * Convert a Promise<A> into a TaskEither<Error, A>
 *
 * @param fn - Function returning a Promise
 */
export function promiseToTE<A>(fn: Lazy<Promise<A>>): TE.TaskEither<Error, A> {
	return TE.tryCatch(fn, (reason: Error | unknown) => {
		const error =
			reason instanceof Error ? reason : new Error(String(reason));

		return error;
	});
}

/**
 * Convert a TaskEither<Error, A> into a Promise<A>
 *
 * @param fn - Function returning a Promise
 */
export function teToPromise<A>(te: TE.TaskEither<Error, A>): Promise<A> {
	return new Promise((resolve, reject) => {
		pipe(
			te,
			TE.fold(
				(error) => {
					reject(error);

					return T.of(undefined);
				},
				(data) => {
					resolve(data);

					return T.of(undefined);
				}
			)
		)().catch(reject);
	});
}

/**
 * Convert an Either<Error, A> into a A, or throw if error
 */
export function eitherToFunction<A>(e: E.Either<Error, A>): A {
	return pipe(
		e,
		E.fold(
			(error) => {
				throw error;
			},
			(data) => data
		)
	);
}
