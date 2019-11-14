import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';

import { LatLng } from '../types';

export interface TestProviderOptions<T> {
  additionalExpects?: (response: T) => void;
  fetchById: string;
  provider: 'aqicn' | 'normalized' | 'waqi';
  fetchBy: 'gps' | 'station';
}

/**
 * Test helper to test a provider
 */
export function testProvider<T>(
  te: TE.TaskEither<Error, T>,
  { additionalExpects, fetchBy, fetchById, provider }: TestProviderOptions<T>
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

export function generateRandomLatLng(): LatLng {
  return {
    latitude: Math.floor(Math.random() * 9000) / 100,
    longitude: Math.floor(Math.random() * 9000) / 100
  };
}

export function generateRandomStationId(): number {
  return Math.floor(Math.random() * 1000) + 1;
}
