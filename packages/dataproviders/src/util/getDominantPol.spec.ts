import { Normalized } from '../types';
import { getDominantPol } from './getDominantPol';
import { OpenAQFormat } from './openaq';

describe('getDominantPol', () => {
	it('should calculate the dominant pollutant', () => {
		const normalized = [
			{ parameter: 'pm25', value: 10 } as OpenAQFormat,
			{ parameter: 'pm10', value: 20 } as OpenAQFormat,
		] as Normalized;

		expect(getDominantPol(normalized)).toBe('pm10');
	});
});
