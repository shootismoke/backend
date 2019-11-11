import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';

import { aqicnByStation, waqiByGps } from './';

function testProvider<T>(
  te: TE.TaskEither<Error, T>,
  {
    fetchBy,
    fetchById,
    provider
  }: {
    fetchById: string;
    provider: 'aqicn' | 'waqi';
    fetchBy: 'gps' | 'station';
  }
): void {
  it(`should fetch ${provider} station by ${fetchBy}: ${fetchById}`, done => {
    pipe(
      te,
      TE.fold(
        error => {
          if (error.message.includes('Unknown ID')) {
            // Skip if the random stationId is an unknown station
            done();

            return T.of(void undefined);
          }
          done.fail(error);

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
  // Create an array of 10 random numbers, do some basic random testing
  // with stations
  const randomStationIds = [];
  while (randomStationIds.length < 10) {
    randomStationIds.push(Math.floor(Math.random() * 1000) + 1);
  }
  randomStationIds
    .map(s => `${s}`)
    .forEach(stationId => {
      testProvider(aqicnByStation(stationId), {
        fetchBy: 'station',
        fetchById: stationId,
        provider: 'aqicn'
      });
    });

  // Create an array of 10 random number tuples, do some basic random testing
  // with lat/lng
  const randomLatLng = [];
  while (randomLatLng.length < 10) {
    randomLatLng.push([
      Math.floor(Math.random() * 9000) / 100,
      Math.floor(Math.random() * 9000) / 100
    ]);
  }
  randomLatLng.forEach(([latitude, longitude]) => {
    testProvider(waqiByGps({ latitude, longitude }), {
      fetchBy: 'gps',
      fetchById: `[${[latitude, longitude]}]`,
      provider: 'waqi'
    });
  });
});
