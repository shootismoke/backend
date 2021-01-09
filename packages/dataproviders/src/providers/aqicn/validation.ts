import * as t from 'io-ts';

import { attributionsCodec } from '../../util';

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
	v: t.number,
});

// Ideally, we should have a list of all pollutants tracked by AqiCN, but I
// didn't finy any. Putting string for now.
const pollutants = t.record(t.string, pollutantValue);

const AqicnStationCodecData = t.type({
	attributions: attributionsCodec,
	city: t.type({
		geo: t.union([
			t.tuple([
				// Somehow, we also sometimes get strings as geo lat/lng
				t.union([t.string, t.number]),
				t.union([t.string, t.number]),
			]),
			// We also could get null
			t.null,
		]),
		name: t.union([t.string, t.undefined]),
		url: t.union([t.string, t.undefined]),
	}),
	// Should be `t.keyof(pollutants.props)`, but sometimes we do get "" or undefined
	dominentpol: t.union([t.string, t.undefined]),
	// All pollutants
	iaqi: t.union([pollutants, t.undefined]),
	// Station ID
	idx: t.number,
	time: t.type({
		// As string
		s: t.union([t.string, t.undefined]),
		// Timezone
		tz: t.union([t.string, t.undefined]),
		// As timestamp
		v: t.number,
	}),
});

export const ByStationCodec = t.type({
	status: t.keyof({
		ok: null,
		error: null,
		nope: null, // http://api.waqi.info/feed/geo:31.54;84.3/?token=
	}),
	data: t.union([AqicnStationCodecData, t.string, t.undefined]),
	msg: t.union([t.string, t.undefined]),
});

export type ByStation = t.TypeOf<typeof AqicnStationCodecData>;
