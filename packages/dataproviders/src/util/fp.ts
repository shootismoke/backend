import { Lazy } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';

/**
 * Convert a Promise<A> into a TaskEither<Error, A>
 * @param fn - Function returning a Promise
 */
export function promiseToTE<A>(fn: Lazy<Promise<A>>): TE.TaskEither<Error, A> {
  return TE.tryCatch(fn, (reason: Error | unknown) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));

    return error;
  });
}
