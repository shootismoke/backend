import { pipe } from 'fp-ts/lib/pipeable';
import * as TE from 'fp-ts/lib/TaskEither';

import { aqicnByGps, aqicnNormalizeByGps } from '../aqicn';
import { LatLng, NormalizedByGps } from '../types';
import {
  generateRandomLatLng,
  testProvider,
  TestProviderOptions
} from '../util';
import { waqiByGps, waqiNormalizeByGps } from '../waqi';
import { normalizedByGps } from './fetchBy';

function additionalExpects(data: NormalizedByGps): void {
  if (data.dailyCigarettes) {
    expect(isNaN(data.dailyCigarettes)).toBe(false);
  }

  expect(data.closestStation.gps.latitude).toBeDefined();
  expect(data.closestStation.gps.longitude).toBeDefined();
  expect(data.closestStation.name).toBeDefined();
  expect(data.closestStation.provider).toBe('waqi');
  expect(data.closestStation.universalId.startsWith('waqi')).toBe(true);
}

function getOptions({
  latitude,
  longitude
}: LatLng): TestProviderOptions<NormalizedByGps> {
  return {
    additionalExpects,
    fetchBy: 'gps',
    fetchById: `[${[latitude, longitude]}]`,
    provider: 'normalized'
  };
}

describe('normalized', () => {
  describe('by gps', () => {
    [...Array(2)].map(generateRandomLatLng).forEach(gps => {
      // Test normalization separately
      testProvider(
        pipe(aqicnByGps(gps), TE.map(aqicnNormalizeByGps)),
        getOptions(gps)
      );
      testProvider(
        pipe(waqiByGps(gps), TE.map(waqiNormalizeByGps)),
        getOptions(gps)
      );

      // Test normalization + race
      testProvider(normalizedByGps(gps), getOptions(gps));
    });
  });
});
