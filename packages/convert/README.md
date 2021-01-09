[![npm (scoped)](https://img.shields.io/npm/v/@shootismoke/convert.svg)](https://www.npmjs.com/package/@shootismoke/convert)
[![dependencies Status](https://david-dm.org/shootismoke/common/status.svg?path=packages/convert)](https://david-dm.org/shootismoke/common?path=packages/convert)
[![Maintainability](https://api.codeclimate.com/v1/badges/2d517984b9b528fcd3cd/maintainability)](https://codeclimate.com/github/shootismoke/common/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/2d517984b9b528fcd3cd/test_coverage)](https://codeclimate.com/github/shootismoke/common/test_coverage)

# `@shootismoke/convert`

A library to convert between various Air Quality Indexes (US, CN...) and their equivalent in pollutant concentration (µg/m³, ppm, ppb).

## Supported Air Quality Indexes

| AQI      | AQI Code<sup>1</sup> | Pollutants                   | Resources                                                                                                                     |
| -------- | -------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| AQI (US) | `usaEpa`             | co, no2, o3, pm10, pm25, so2 | US Environmental Protection Agency (EPA) [[link]](https://www3.epa.gov/airnow/aqi-technical-assistance-document-sept2018.pdf) |
| AQI (CN) | `chnMep`             | co, no2, o3, pm10, pm25, so2 | China Ministry of Environmental Protection (MEP) [[link]](http://www.zzemc.cn/em_aw/Content/HJ633-2012.pdf)                   |

We also plan to support other AQIs in the future, see [issue #15](https://github.com/shootismoke/common/issues/15) if you want to help.

<sub><sup>1</sup>: We use the same AQI code as [Breezometer](https://docs.breezometer.com/api-documentation/air-quality-api/v2/#supported-air-quality-indexes), the only difference is that the code here is camelCase, because JavaScript likes camelCase.</sub>

## ⚡ Get Started

Install the package:

```bash
yarn install @shootismoke/convert
```

The package mainly exports the `convert` function.

### `convert(pollutant, from, to, value)`

The function can convert, for any pollutant:

-   from a raw concentration to a supported AQI
-   from a supported AQI to a raw concentration
-   from a supported AQI to another AQI

Arguments:

-   `pollutant: Pollutant`: One of the supported pollutants, [see them](#supported-pollutants).
-   `from: AqiCode | 'raw'`: An AQI code or the `'raw'` string
-   `to: AqiCode | 'raw'`: An AQI code or the `'raw'` string
-   `value: number`: The value to convert

```typescript
import { convert, getPollutantMeta } from '@shootismoke/convert';

// Convert PM2.5 from usaEpa AQI to raw concentration
const raw = convert('pm25', 'usaEpa', 'raw', 57);
console.log(raw); // 15

console.log(getPollutantMeta('pm25').preferredUnit); // "µg/m³", which is the unit of the value 15 above

// Convert PM2.5 from raw concentration to usaEPA AQI
const aqi = convert('pm25', 'raw', 'usaEpa', 15);
console.log(aqi); // 57
```

### Supported Pollutants

The pollutants the AQIs apply to are: `'bc' | 'co' | 'c6h6' | 'ox' | 'nh3' | 'nmhc' | 'no' | 'nox' | 'no2' | 'o3' | 'pm10' | 'pm25' | 'so2' | 'trs'`. Check [this file](./src/util/pollutant.ts) to see the metadata for each pollutant (full name, unit...).

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
