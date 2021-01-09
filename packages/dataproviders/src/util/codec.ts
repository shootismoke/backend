/**
 * @ignore
 */ /** */

import axios from 'axios';
import debug from 'debug';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import * as TE from 'fp-ts/lib/TaskEither';
import { Type } from 'io-ts';
import { failure } from 'io-ts/lib/PathReporter';

import { promiseToTE } from './fp';

const l = debug('shootismoke:dataproviders');

/**
 * Decode, and return an Error on failure
 *
 * @param codec - Codec used to decode
 */
export function decodeWith<A, O, I>(
	codec: Type<A, O, I>
): (response: I) => TE.TaskEither<Error, A> {
	return (response: I): TE.TaskEither<Error, A> =>
		TE.fromEither(
			pipe(
				codec.decode(response),
				E.mapLeft((errors) => new Error(failure(errors).join('\n')))
			)
		);
}

/**
 * Fetch with axios from URL, and decode using io-ts
 *
 * @param url - The URL to fetch from
 * @param codec = The io-ts codec used for decoding
 * @param options - Additional options, e.g. error handling
 */
export function fetchAndDecode<A, E, O, I>(
	url: string,
	codec: Type<A, O, I>,
	options: {
		onError?: (error: E) => Error;
	} = {}
): TE.TaskEither<Error, A> {
	l(`Fetching URL ${url}`);

	return pipe(
		promiseToTE(() =>
			axios
				.get(url)
				.then(({ data }) => data as I)
				.catch((error) => {
					throw options.onError ? options.onError(error) : error;
				})
		),
		TE.chain(decodeWith(codec))
	);
}
