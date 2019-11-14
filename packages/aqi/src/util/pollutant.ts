export type Pollutant = 'co' | 'no2' | 'o3' | 'pm10' | 'pm25' | 'so2'; // We only track these pollutants for now

export const POLLUTANTS: Pollutant[] = [
  'co',
  'no2',
  'o3',
  'pm10',
  'pm25',
  'so2'
];

/**
 * Check if the input pollutant is a recognized pollutant which we can convert
 * AQI to/from raw values
 *
 * @param pollutant - The pollutant to test
 */
export function isPollutant(pollutant: string): pollutant is Pollutant {
  return POLLUTANTS.includes(pollutant as Pollutant);
}
