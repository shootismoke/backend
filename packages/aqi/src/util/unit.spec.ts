import { Pollutant } from './pollutant';
import { getUnit, Unit } from './unit';

function testUnit(pollutant: Pollutant, unit: Unit): void {
  it(`should test ${pollutant} unit correctly`, () => {
    expect(getUnit(pollutant)).toBe(unit);
  });
}

describe('getUnit', () => {
  testUnit('co', 'ppm');
  testUnit('no2', 'ppb');
  testUnit('o3', 'ppm');
  testUnit('pm10', 'µg/m³');
  testUnit('pm25', 'µg/m³');
  testUnit('so2', 'ppb');
});
