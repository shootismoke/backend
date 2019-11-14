import { generateRandomLatLng, testProvider } from '../util';
import { waqiByGps } from './fetchBy';

describe('waqi', () => {
  describe('by gps', () => {
    [...Array(10)]
      .map(generateRandomLatLng)
      .forEach(({ latitude, longitude }) => {
        testProvider(waqiByGps({ latitude, longitude }), {
          fetchBy: 'gps',
          fetchById: `[${[latitude, longitude]}]`,
          provider: 'waqi'
        });
      });
  });
});
