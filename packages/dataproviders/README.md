[![npm (scoped)](https://img.shields.io/npm/v/@shootismoke/dataproviders.svg)](https://www.npmjs.com/package/@shootismoke/dataproviders)
[![dependencies Status](https://david-dm.org/shootismoke/common/status.svg?path=packages/dataproviders)](https://david-dm.org/shootismoke/common?path=packages/dataproviders)
[![Maintainability](https://api.codeclimate.com/v1/badges/2d517984b9b528fcd3cd/maintainability)](https://codeclimate.com/github/shootismoke/common/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/2d517984b9b528fcd3cd/test_coverage)](https://codeclimate.com/github/shootismoke/common/test_coverage)

# `@shootismoke/dataproviders`

A library to fetch air quality data from various providers (AqiCN, OpenAQ...) and normalizing data into one common format: the [openaq-data-format](#normalized-data-format).

## Supported Air Quality Providers

| Provider | Provider Code | Website            | Notes                                                                            |
| -------- | ------------- | ------------------ | -------------------------------------------------------------------------------- |
| AqiCN    | `aqicn`       | https://aqicn.org  | API token needed, get one for free [here](https://aqicn.org/data-platform/token) |
| WAQI     | `waqi`        | https://waqi.info/ | Same institution as AqiCN                                                        |
| OpenAQ   | `openaq`      | https://openaq.org |                                                                                  |

We plan to support more air quality providers in the future see [issue #29](https://github.com/shootismoke/common/issues/29).

## ⚡ Get Started

Install the package:

```bash
yarn install @shootismoke/dataproviders
```

The package exposes a couple of data providers (see list above), and for each data provider, there are two main functions:

- `fetchByGps({ latitude, longitude }, options?)` - Fetch air quality data by GPS coordinates
- `fetchByStation(stationId, options?)` - Fetch air quality data by station ID

### Usage with `fp-ts`

The codebase uses [`io-ts`](https://github.com/gcanti/io-ts) to perform runtime data validation, the results are functional programming datatypes (`Either<E,A>`, `Task<E,A>`). It's recommended to use [`fp-ts`](https://github.com/gcanti/fp-ts) to manipulate the results.

```typescript
// Retrieve the providers by provider code
import { aqicn, openaq } from '@shootismoke/dataproviders';

aqicn.fetchByGps({ latitude: 45, longitude: 23 }); // Returns a TaskEither<Error, AqicnData>

// Usage with fp-ts

import { pipe } from 'fp-ts/lib/pipeable';
import * as TE from 'fp-ts/lib/TaskEither';

pipe(
  // Fetch data from station 'Coyhaique' on the OpenAQ platform
  openaq.fetchByStation('Coyhaique'),
  // Normalize the data
  TE.chain(response => TE.fromEither(normalize(response))),
  // Depending on error/result case, do different stuff
  TE.fold(
    // Do on error:
    error => {
      console.error(error);

      // ...snip...
    },
    // Do on success:
    results => {
      const normalized = results[0]; // `results` is an array of normalized OpenAQ objects
      console.log(`${normalized.value} ${normalized.unit}`); // Logs "34.5 µg/m³"

      // ...snip...
    }
  )
);
```

### Usage as `Promise`

If you don't want to use `fp-ts`, the package also exports the data providers as JavaScript `Promise`s.

```typescript
// Retrieve the providers by provider code, notice the `/lib/promise` subpath here!
import { aqicn } from '@shootismoke/dataproviders/lib/promise';

async function main() {
  const data = await aqicn.fetchByStation(1045);
  console.log(data.dominentpol); // Logs "pm25"

  const results = aqicn.normalizeByStation(data); // `results` is an array of normalized OpenAQ objects
  const normalized = results[0];
  console.log(`${normalized.value} ${normalized.unit}`); // Logs "34.5 µg/m³"
}
```

### Normalized Data Format

If you use the `.normalizeByGps` or `.normalizeByStation` functions, the output will be normalized. We follow the [`openaq-data-format`](https://github.com/openaq/openaq-data-format), below are its **required** fields:

```typescript
/**
 * The OpenAQ data format. One such object represents one air quality
 * measurement
 */
interface OpenAQFormat {
  /**
   * City (or regional approximation) containing location
   */
  city: string;
  /**
   * Coordinates where the measurement took place. Note that in the
   * openaq-data-format, this field is optional. Using this library, this field
   * will **always** be populated
   */
  coordinates: {
    latitude: number;
    longitude: number;
  };
  /**
   * Country containing location in two letter ISO format
   */
  country: string;
  /**
   * Time of measurement including both local time and UTC time.
   */
  date: {
    local: string;
    utc: string;
  };
  /**
   * A unique ID representing the location of a measurement (can be a station
   * ID, a place...)
   */
  location: string;
  /**
   * The pollutant id (pm25, pm10, o3...)
   */
  parameter: Pollutant;
  /**
   * The value of the measurement
   */
  value: number;
  /**
   * The unit the value is measured in (µg/m³, ppm)
   */
  unit: Unit;
}

/**
 * The normalized data is an array of OpenAQ measurements. We ensure there is
 * always at least one element in the Normalized array
 */
type Normalized = OpenAQ[];
```

See [`openaq-data-format`](https://github.com/openaq/openaq-data-format) for more information. Note that in the above format, the `coordinates` field is always required, whereas it's optional in `openaq-data-format`.

### Full Documentation

See the API reference [documentation](./docs/globals.md).

## :raising_hand: Contribute

1. Fork the repo
2. Make your changes in your own fork
3. Make sure `yarn lint` and `yarn test` pass
4. Create a Pull Request on this repo

## Tests

Look out for `*.spec.ts` in the codebase. Run:

```bash
yarn test
```

## :newspaper: License

GPL-3.0. See [LICENSE](./LICENSE) file for more information.
