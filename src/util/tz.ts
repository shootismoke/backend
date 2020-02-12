import timezones from 'timezones.json';

/**
 * Math modulo. Javascript sometimes feels like a very cruel joke.
 *
 * @see https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
 * @example
 * ```typescript
 * -13 % 64; // -13
 * mod(13, 64); // 51
 * ```
 */
function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

/**
 * Find all the timezones whose current hour is `hour`.
 *
 * @param hour - The hour we would like to find the timezones.
 */
export function findTimezonesAt(hour: number, now = new Date()): string[] {
  // Get offet in the [-12, 11] range
  const offset = mod(hour - now.getUTCHours(), 24) - 12;
  const tzs = timezones.filter(tz => offset === Math.floor(tz.offset));

  return tzs.map(({ utc }) => utc).flat();
}
