import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import * as TE from 'fp-ts/lib/TaskEither';
import { Type } from 'io-ts';
import { failure } from 'io-ts/lib/PathReporter';

export function decodeWith<A, O, I>(
  codec: Type<A, O, I>
): (response: I) => TE.TaskEither<Error, A> {
  return (response: I): TE.TaskEither<Error, A> =>
    TE.fromEither(
      pipe(
        codec.decode(response),
        E.mapLeft(errors => new Error(failure(errors).join('\n')))
      )
    );
}
