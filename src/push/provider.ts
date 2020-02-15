import { AllProviders, OpenAQFormat } from '@shootismoke/dataproviders';
import { aqicn, openaq, waqi } from '@shootismoke/dataproviders/lib/promise';

type AllProviders = 'aqicn' | 'openaq' | 'waqi';

/**
 * Convert raw pm25 level to number of cigarettes. 1 cigarette is equivalent of
 * a PM2.5 level of 22ug/m3.
 *
 * @see http://berkeleyearth.org/air-pollution-and-cigarette-equivalence/
 * @param rawPm25 - The raw PM2.5 level, in ug/m3
 */
export function pm25ToCigarettes(rawPm25: number): number {
  return rawPm25 / 22;
}

/**
 * Given some normalized data points, filter out the first one that contains
 * pm25 data. Returns a TaskEither left is none is found, or format the data
 * into the Api interface
 *
 * @param normalized - The normalized data to process
 */
async function providerFetch(
  provider: AllProviders,
  station: string
): Promise<OpenAQFormat> {
  const normalized =
    provider === 'aqicn'
      ? aqicn.normalizeByStation(
          await aqicn.fetchByStation(station, {
            token: process.env.AQICN_TOKEN as string
          })
        )
      : provider === 'waqi'
      ? waqi.normalizeByStation(await waqi.fetchByStation(station))
      : openaq.normalizeByStation(
          await openaq.fetchByStation(station, {
            limit: 1,
            parameter: ['pm25']
          })
        );

  const pm25 = normalized.filter(({ parameter }) => parameter === 'pm25');

  if (pm25.length) {
    return pm25[0];
  } else {
    throw new Error(
      `PM2.5 has not been measured by station ${normalized[0].location} right now`
    );
  }
}

/**
 * Fetch data from correct provider, based on universalId.
 *
 * @param universalId - The universalId of the station
 */
export async function universalFetch(
  universalId: string
): Promise<OpenAQFormat> {
  const [provider, station] = universalId.split('|');

  if (!AllProviders.includes(provider)) {
    throw new Error(
      `universalFetch: Unrecognized universalId "${universalId}".`
    );
  }

  return await providerFetch(provider as AllProviders, station);
}
