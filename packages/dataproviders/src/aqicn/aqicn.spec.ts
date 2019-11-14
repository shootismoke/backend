import * as E from 'fp-ts/lib/Either';

import {
  generateRandomLatLng,
  generateRandomStationId,
  testProvider
} from '../util';
import { aqicnByGps, aqicnByStation } from './fetchBy';

describe('aqicn', () => {
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

    it('should throw an error if no station is found', async done => {
      const e = await aqicnByStation('foobar')();
      expect(e).toEqual(E.left(new Error('Unknown station')));

      done();
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
      });
  });
});
