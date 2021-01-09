import { convert } from './convert';

describe('convert', () => {
	it('should return the same value for ugm3->ugm3 conversion', () => {
		expect(convert('pm25', 'ugm3', 'ugm3', 45)).toBe(45);
	});
});
