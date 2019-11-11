import 'isomorphic-fetch';

import { pipe } from 'fp-ts/lib/pipeable';
import * as TE from 'fp-ts/lib/TaskEither';

import { LatLng } from '../types';
import { decodeWith, promiseToTE } from '../util';
import { AqicnStation, AqicnStationCodec } from './validation';

export function aqicnByGps(gps: LatLng): TE.TaskEither<Error, AqicnStation> {
  const { latitude, longitude } = gps;

  return pipe(
    promiseToTE(() =>
      fetch(
        `http://api.waqi.info/feed/geo:${latitude};${longitude}/?token=${process.env.WAQI_TOKEN}`
      ).then(response => response.json())
    ),
    TE.chain(decodeWith(AqicnStationCodec)),
    TE.chain(({ status, data }) =>
      status === 'ok'
        ? TE.right(data as AqicnStation)
        : TE.left(new Error(data as string))
    )
  );
}
