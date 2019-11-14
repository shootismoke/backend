/**
 * Round a number to closest 0.1
 *
 * @param n - The float number to round
 */
export function roundTo1Decimal(n: number): number {
  return Math.round(10 * n) / 10;
}
