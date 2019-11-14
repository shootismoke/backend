import * as E from 'fp-ts/lib/Either';

import { AqicnStationCodec } from '../aqicn';
import { decodeWith } from './codec';

describe('codec decode', () => {
  it('should return left when decode fails', async done => {
    expect(await decodeWith(AqicnStationCodec)('foo')()).toEqual(
      E.left(
        new Error(
          'Invalid value "foo" supplied to : { status: "ok" | "error" | "nope", data: ({ attributions: Array<{ name: string, url: (string | undefined) }>, city: { geo: ([(string | number), (string | number)] | null), name: (string | undefined), url: (string | undefined) }, dominentpol: (string | undefined), iaqi: (Partial<{ co: { v: number }, h: { v: number }, no2: { v: number }, o3: { v: number }, p: { v: number }, pm10: { v: number }, pm25: { v: number }, so2: { v: number }, t: { v: number }, w: { v: number } }> | undefined), idx: number, time: { s: (string | undefined), tz: (string | undefined), v: number } } | string | undefined), msg: (string | undefined) }'
        )
      )
    );
    done();
  });
});
