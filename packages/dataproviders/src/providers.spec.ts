import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';

import { aqicnByStation, waqiByGps } from './';

function testProvider<T>(
  te: TE.TaskEither<Error, T>,
  provider: 'aqicn' | 'waqi',
  fetchBy: 'gps' | 'station'
): void {
  it(`should fetch ${provider} by ${fetchBy}`, done => {
    pipe(
      te,
      TE.fold(
        error => {
          console.log(error);
          done.fail();

          return T.of(void undefined);
        },
        response => {
          expect(response).toBeDefined();

          done();

          return T.of(void undefined);
        }
      )
    )();
  });
}

describe('data providers', () => {
  testProvider(aqicnByStation('8374'), 'aqicn', 'station');
  testProvider(waqiByGps({ latitude: 23, longitude: 45 }), 'waqi', 'gps');
});
