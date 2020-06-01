import { pm25ToCigarettes } from './provider';

describe('pm25ToCigarettes', () => {
	it('should convert 44ug/m3 to 2 cigarettes', () => {
		expect(pm25ToCigarettes(44)).toBe(2);
	});
});
