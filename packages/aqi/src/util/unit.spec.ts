import { Pollutant } from '../types';
import { getUnit, Unit } from './unit';

function testUnit(pollutant: Pollutant, unit: Unit): void {
  it(`should test ${pollutant} unit correctly`, () => {
    expect(getUnit(pollutant)).toBe(unit);
  });
}

describe('getUnit', () => {
  testUnit('pm25', 'µg/m³');
});
