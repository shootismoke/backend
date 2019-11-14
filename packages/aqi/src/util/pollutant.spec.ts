import { isPollutant } from './pollutant';

describe('isPollutant', () => {
  it('should return true for pm25', () => {
    expect(isPollutant('pm25')).toBe(true);
  });

  it('should return false for foo', () => {
    expect(isPollutant('foo')).toBe(false);
  });
});
