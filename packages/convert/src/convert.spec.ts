import { convert } from './convert';

describe('convert', () => {
	it('should return the same value for raw->raw conversion', () => {
		expect(convert('pm25', 'raw', 'raw', 45)).toBe(45);
	});
});
