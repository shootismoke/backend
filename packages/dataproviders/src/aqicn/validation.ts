import * as t from 'io-ts';

// Example response
// Object {
//   "data": Object {
//     "aqi": 51,
//     "attributions": Array [
//       Object {
//         "name": "Air Lorraine - Surveillance et étude de la qualité de l'air en Lorraine",
//         "url": "http://air-lorraine.org/",
//       },
//       Object {
//         "name": "European Environment Agency",
//         "url": "http://www.eea.europa.eu/themes/air/",
//       },
//     ],
//     "city": Object {
//       "geo": Array [
//         49.39429190887402,
//         6.201473467510839,
//       ],
//       "name": "Garche, Thionville-Nord",
//       "url": "http://aqicn.org/city/france/lorraine/thionville-nord/garche/",
//     },
//     "dominentpol": "pm25",
//     "iaqi": Object {
//       "no2": Object {
//         "v": 3.2,
//       },
//       "o3": Object {
//         "v": 34.6,
//       },
//       "p": Object {
//         "v": 1012.5,
//       },
//       "pm10": Object {
//         "v": 20,
//       },
//       "pm25": Object {
//         "v": 51,
//       },
//       "so2": Object {
//         "v": 1.6,
//       },
//       "t": Object {
//         "v": 21.6,
//       },
//     },
//     "idx": 7751,
//     "time": Object {
//       "s": "2018-08-09 14:00:00",
//       "tz": "+01:00",
//       "v": 1533823200,
//     },
//   },
//   "status": "ok",
// }

const pollutantValue = t.type({
  v: t.number
});

const pollutants = t.partial({
  co: pollutantValue,
  h: pollutantValue,
  no2: pollutantValue,
  o3: pollutantValue,
  p: pollutantValue,
  pm10: pollutantValue,
  pm25: pollutantValue,
  so2: pollutantValue,
  t: pollutantValue,
  w: pollutantValue
});

const AqicnStationCodecData = t.type({
  attributions: t.array(
    t.type({
      name: t.string,
      url: t.union([t.string, t.undefined])
    })
  ),
  city: t.type({
    geo: t.tuple([t.number, t.number]),
    name: t.union([t.string, t.undefined]),
    url: t.union([t.string, t.undefined])
  }),
  dominentpol: t.keyof(pollutants.props),
  iaqi: pollutants,
  idx: t.number,
  time: t.type({
    s: t.union([t.string, t.undefined]),
    tz: t.union([t.string, t.undefined]),
    v: t.number
  })
});

export const AqicnStationCodec = t.type({
  status: t.keyof({
    ok: null,
    error: null
  }),
  data: t.union([AqicnStationCodecData, t.string])
});

export type AqicnStation = t.TypeOf<typeof AqicnStationCodecData>;
