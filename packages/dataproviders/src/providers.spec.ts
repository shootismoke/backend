import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';

import { aqicnByGps, aqicnByStation, waqiByGps } from './';
import { normalizedByGps } from './normalized/fetchBy';
import { LatLng } from './types';

function testProvider<T>(
  te: TE.TaskEither<Error, T>,
  {
    additionalExpects,
    fetchBy,
    fetchById,
    provider
  }: {
    additionalExpects?: (response: T) => void;
    fetchById: string;
    provider: 'aqicn' | 'normalized' | 'waqi';
    fetchBy: 'gps' | 'station';
  }
): void {
  it(`should fetch ${provider} station by ${fetchBy}: ${fetchById}`, done => {
    pipe(
      te,
      TE.fold(
        error => {
          if (
            // Skip if the random stationId is an unknown station
            error.message.includes('Unknown ID') ||
            // Skip if we somehow couldn't connect
            error.message.includes('can not connect')
          ) {
            done();

            return T.of(void undefined);
          }
          done.fail(error);

          return T.of(void undefined);
        },
        response => {
          expect(response).toBeDefined();

          additionalExpects && additionalExpects(response);

          done();

          return T.of(void undefined);
        }
      )
    )();
  });
}

function generateRandomLatLng(): LatLng {
  return {
    latitude: Math.floor(Math.random() * 9000) / 100,
    longitude: Math.floor(Math.random() * 9000) / 100
  };
}

function generateRandomStationId(): number {
  return Math.floor(Math.random() * 1000) + 1;
}

describe('data providers', () => {
  describe('by station', () => {
    [...Array(10)]
      .map(generateRandomStationId)
      .map(s => `${s}`)
      .forEach(stationId => {
        testProvider(aqicnByStation(stationId), {
          fetchBy: 'station',
          fetchById: stationId,
          provider: 'aqicn'
        });
      });
  });

  describe('by gps', () => {
    [...Array(10)]
      .map(generateRandomLatLng)
      .forEach(({ latitude, longitude }) => {
        testProvider(aqicnByGps({ latitude, longitude }), {
          fetchBy: 'gps',
          fetchById: `[${[latitude, longitude]}]`,
          provider: 'aqicn'
        });

        testProvider(waqiByGps({ latitude, longitude }), {
          fetchBy: 'gps',
          fetchById: `[${[latitude, longitude]}]`,
          provider: 'waqi'
        });

        testProvider(normalizedByGps({ latitude, longitude }), {
          additionalExpects: data => {
            if (data.dailyCigarettes) {
              expect(isNaN(data.dailyCigarettes)).toBe(false);
            }

            expect(data.closestStation.gps.latitude).toBeDefined();
            expect(data.closestStation.gps.longitude).toBeDefined();
            expect(data.closestStation.name).toBeDefined();
            expect(data.closestStation.provider).toBe('waqi');
            expect(data.closestStation.universalId.startsWith('waqi')).toBe(
              true
            );
          },
          fetchBy: 'gps',
          fetchById: `[${[latitude, longitude]}]`,
          provider: 'normalized'
        });
      });
  });
});
