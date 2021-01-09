import { AllPollutants } from '@shootismoke/convert';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';

import { LatLng, Normalized, Provider } from '../types';

function generateRandomLatLng(): LatLng {
	return {
		latitude: Math.floor(Math.random() * 9000) / 100,
		longitude: Math.floor(Math.random() * 9000) / 100,
	};
}

function generateRandomStationId(): string {
	return `${Math.floor(Math.random() * 1000) + 1}`;
}

/**
 * Test that normalized data is correct
 *
 * @param normalized - The normalized data to test
 */
export function testNormalized(normalized: Normalized): void {
	normalized.forEach((data) => {
		expect(data.country.length).toBe(2);
		expect(data.date).toBeDefined();
		expect(data.location).toHaveProperty('latitude');
		expect(data.location).toHaveProperty('longitude');
		expect(AllPollutants.includes(data.parameter)).toBe(true);
		expect(data.value).toBeDefined();
		expect(data.unit).toBeDefined();
	});
}

/**
 * Test that a TE is resolving correctly.
 */
export function testTE<T>(
	te: TE.TaskEither<Error, T>,
	normalize: (data: T) => E.Either<Error, Normalized>,
	done: jest.DoneCallback
): void {
	pipe(
		te,
		TE.map((response) => {
			expect(response).toBeDefined();

			return response;
		}),
		TE.chain((response) => TE.fromEither(normalize(response))),
		TE.fold(
			(error) => {
				// We don't fail the test if one of the following errors occur
				const skippedErrorMessages = [
					// Skip if the random stationId is an unknown station
					'Unknown ID',
					// Skip if we somehow couldn't connect
					'can not connect',
					// Skip if openaq doesn't return results
					'[openaq] Cannot normalize, got 0 result',
					// Skip if aqicn doesn't track pollutants that don't interest us
					'no pollutants currently tracked',
					// Skip if aqicn doesn't expose city
					'no city',
					// Skip if cannot find country for waqi
					'[waqi] Cannot get code from country',
				];

				if (
					skippedErrorMessages.some((msg) =>
						error.message.includes(msg)
					)
				) {
					done();

					return T.of(void undefined);
				}

				done.fail(error);
				return T.of(void undefined);
			},
			() => {
				done();
				return T.of(void undefined);
			}
		)
	)().catch(console.error);
}

interface TestProviderE2EOptions<Options> {
	options?: Options;
	skip?: ('fetchByGps' | 'fetchByStation')[];
}

/**
 * Test helper to test a provider
 */
export function testProviderE2E<DataByGps, DataByStation, Options>(
	provider: Provider<DataByGps, DataByStation, Options>,
	{ options, skip = [] }: TestProviderE2EOptions<Options>
): void {
	jest.setTimeout(30000);

	if (!skip.includes('fetchByGps')) {
		describe('fetchByGps', () => {
			[...Array(2)].map(generateRandomLatLng).forEach((gps) => {
				it(`should fetch ${provider.id} by gps: ${JSON.stringify(
					gps
				)}`, (done) =>
					testTE(
						provider.fetchByGps(gps, options),
						(d) => provider.normalizeByGps(d),
						done
					));
			});
		});
	}

	if (!skip.includes('fetchByStation')) {
		describe('fetchByStation', () => {
			[...Array(2)].map(generateRandomStationId).forEach((stationId) => {
				it(`should fetch ${provider.id} by station: ${stationId}`, (done) =>
					testTE(
						provider.fetchByStation(stationId, options),
						(d) => provider.normalizeByStation(d),
						done
					));
			});
		});
	}

	jest.setTimeout(5000);
}
