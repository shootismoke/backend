import { OpenAQFormat } from './openaq';
import { stationName } from './stationName';

describe('stationName', () => {
	it('should take attribution if it exists', () => {
		expect(
			stationName({ attribution: [{ name: 'foo' }] } as OpenAQFormat)
		).toBe('foo');
	});

	it('should take location name', () => {
		expect(stationName({ location: 'foo' } as OpenAQFormat)).toBe(
			'Station foo'
		);
	});
});
