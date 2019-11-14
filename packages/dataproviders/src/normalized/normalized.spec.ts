import { generateRandomLatLng, testProvider } from '../util';
import { normalizedByGps } from './fetchBy';

describe('normalized', () => {
  describe('by gps', () => {
    [...Array(2)]
      .map(generateRandomLatLng)
      .forEach(({ latitude, longitude }) => {
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
