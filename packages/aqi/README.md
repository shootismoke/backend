[![npm (scoped)](https://img.shields.io/npm/v/@shootismoke/aqi.svg)](https://www.npmjs.com/package/@shootismoke/aqi)
[![dependencies Status](https://david-dm.org/shootismoke/backend/status.svg?path=packages/aqi)](https://david-dm.org/shootismoke/backend?path=packages/aqi)

# `@shootismoke/aqi`

A library to convert between AQI (US or CN) value and pollutant concentration (µg/m³ or ppm) using the following standards:

- US AQI: United States Environmental Protection Agency (EPA)
- CN AQI: China Ministry of Environmental Protection (MEP)

## ⚡ Get Started

Install the package

```bash
yarn install @shootismoke/aqi
```

### `aqiToRaw(pollutant: Pollutant, aqi: number, aqiType: AqiType = 'US'): number`

Converts an AQI value to raw concentration (µg/m³ or ppm).

Arguments:

- `pollutant: Pollutant`: One of `'co' | 'h' | 'no2' | 'o3' | 'p' | 'pm10' | 'pm25' | 'so2' | 't' | 'w'`
- `aqi: number`: The AQI value
- `aqiType: AqiType`: One of `'US' | 'CN'`

```typescript
import { aqiToRaw } from '@shootismoke/aqi';

const raw = aqiToRaw('pm25', 57, 'US');
console.log(raw); // 15
```

### `aqiToRaw(pollutant: Pollutant, raw: number, aqiType: AqiType = 'US'): number`

Converts a raw concentration (µg/m³ or ppm) to AQI value.

Arguments:

- `pollutant: Pollutant`: One of `'co' | 'h' | 'no2' | 'o3' | 'p' | 'pm10' | 'pm25' | 'so2' | 't' | 'w'`
- `raw: number`: The raw concentration
- `aqiType: AqiType`: One of `'US' | 'CN'`

```typescript
import { rawToAqi } from '@shootismoke/aqi';

const aqi = aqiToRaw('pm25', 15, 'US');
console.log(aqi); // 57
```

### `getUnit(pollutant: Pollutant): Unit`

Gets the unit of a pollutant (µg/m³ or ppm).

Arguments:

- `pollutant: Pollutant`: One of `'co' | 'h' | 'no2' | 'o3' | 'p' | 'pm10' | 'pm25' | 'so2' | 't' | 'w'`

```typescript
import { getUnit } from '@shootismoke/aqi';

const unit = getUnit('pm25');
console.log(unit); // 'µg/m³'
```

## :raising_hand: Contribute

1. Fork the repo
2. Make your changes in your own fork
3. Create a Pull Request on this repo

## :microscope: Tests

Look out for `*.spec.ts` in the codebase.

```bash
yarn test
```

## :books: Resources

- EPA AQI: Technical Assistance Document for the Reporting of Daily Air
  Quality – the Air Quality Index (AQI) December 2013) found at http://www.epa.gov/airnow/aqi-technical-assistance-document-dec2013.pdf
- National Ambient Air Quality Standards for Particulate Matter found at http://www.gpo.gov/fdsys/pkg/FR-2013-01-15/pdf/2012-30946.pdf
- MEP AQI:
  - GB3095—2012 (2012/02/29) found at http://www.mep.gov.cn/gkml/hbb/bwj/201203/t20120302_224147.htm
  - HJ633-2012 (2012/02/29) found at http://www.zzemc.cn/em_aw/Content/HJ633-2012.pdf

## :newspaper: License

GPL-3.0. See [LICENSE](./LICENSE) file for more information.
