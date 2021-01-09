import { getPollutantMeta, isPollutant, ugm3 } from './pollutant';

describe('isPollutant', () => {
	it('should return true for pm25', () => {
		expect(isPollutant('pm25')).toBe(true);
	});

	it('should return false for foo', () => {
		expect(isPollutant('foo')).toBe(false);
	});
});

describe('getPollutantMeta', () => {
	it('should return correct metadata', () => {
		expect(getPollutantMeta('pm25')).toEqual({
			id: 'pm25',
			name: 'PM25',
			description: 'Fine particulate matter (<2.5µm)',
			preferredUnit: ugm3,
		});
	});
});
