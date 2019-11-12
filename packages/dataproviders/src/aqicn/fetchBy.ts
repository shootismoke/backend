import 'isomorphic-fetch';

import { pipe } from 'fp-ts/lib/pipeable';
import * as TE from 'fp-ts/lib/TaskEither';
import { TypeOf } from 'io-ts';

import { LatLng } from '../types';
import { decodeWith, promiseToTE } from '../util';
import { AqicnStation, AqicnStationCodec } from './validation';

/**
 * Check if the response we get from aqicn is `{"status": "error", "msg": "..."}`,
 * if yes, return an error.
 */
function checkError({
  status,
  data,
  msg
}: TypeOf<typeof AqicnStationCodec>): TE.TaskEither<Error, AqicnStation> {
  return status === 'ok'
    ? TE.right(data as AqicnStation)
    : TE.left(new Error(msg || (data as string)));
}

export function aqicnByGps(gps: LatLng): TE.TaskEither<Error, AqicnStation> {
  const { latitude, longitude } = gps;

  return pipe(
    promiseToTE(() =>
      fetch(
        `http://api.waqi.info/feed/geo:${latitude};${longitude}/?token=${process.env.WAQI_TOKEN}`
      ).then(response => response.json())
    ),
    TE.chain(decodeWith(AqicnStationCodec)),
    TE.chain(checkError)
  );
}

export function aqicnByStation(
  stationId: string
): TE.TaskEither<Error, AqicnStation> {
  return pipe(
    promiseToTE(() =>
      fetch(
        `https://api.waqi.info/feed/@${stationId}/?token=${process.env.WAQI_TOKEN}`
      ).then(response => response.json())
    ),
    TE.chain(decodeWith(AqicnStationCodec)),
    TE.chain(checkError)
  );
}
