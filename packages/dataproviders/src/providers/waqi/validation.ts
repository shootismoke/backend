import * as t from 'io-ts';

// Example response:
// Object {
//   "d": Array [
//     Object {
//       "d": 0.8,
//       "geo": Array [
//         52.489451,
//         13.430844,
//       ],
//       "key": "_c08tyk3Mq9R3Si3KyczT90stzT68LScnT9cvMa84Na-4pCjx8PxUAA",
//       "nlo": "Neukölln-Nansenstraße, Berlin",
//       "nna": "",
//       "pol": "pm25",
//       "t": 1533819600,
//       "u": "Germany/Berlin/Neukölln-Nansenstraße",
//       "v": "75",
//       "x": "10032",
//     },
//   ],
//   "g": null,
// }

export const ByStationCodec = t.type({
	d: t.array(
		t.type({
			d: t.number,
			geo: t.tuple([t.number, t.number]),
			key: t.string,
			nlo: t.string,
			nna: t.string,
			pol: t.string,
			t: t.number,
			u: t.string,
			v: t.string,
			x: t.string,
		})
	),
	g: t.any,
});

export type ByStation = t.TypeOf<typeof ByStationCodec>;
