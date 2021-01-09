import { IUser } from '@shootismoke/types';
import { BackendError } from '@shootismoke/types';
import axios, { AxiosError } from 'axios';
import { connection } from 'mongoose';

import { connectToDatabase } from '../../src/util';
import { alice, BACKEND_URL, bob } from '../util/testdata';

let dbAlice: IUser;

describe('users::updateUser', () => {
	beforeAll(async (done) => {
		await connectToDatabase();
		await connection.dropDatabase();

		const { data } = await axios.post<IUser>(
			`${BACKEND_URL}/api/users`,
			alice
		);
		await axios.post<IUser>(`${BACKEND_URL}/api/users`, bob);

		dbAlice = data;

		done();
	});

	function testBadInput<T>(name: string, input: T, expErr: string) {
		it(`should require correct input: ${name}`, async (done) => {
			try {
				await axios.patch(
					`${BACKEND_URL}/api/users/${dbAlice._id}`,
					input
				);
				done.fail();
			} catch (err) {
				const e = err as AxiosError<BackendError>;
				expect(e.response?.status).toBe(500);
				expect(e.response?.data.error).toContain(expErr);
				done();
			}
		});
	}

	function testGoodInput<T>(name: string, input: T) {
		it(`should be correct input: ${name}`, async (done) => {
			const { data } = await axios.patch<IUser>(
				`${BACKEND_URL}/api/users/${dbAlice._id}`,
				input
			);

			expect(data).toMatchObject(input);

			done();
		});
	}

	testGoodInput('empty input', {});
	testBadInput(
		'no lastStationId',
		{ lastStationId: null },
		'Path `lastStationId` is required'
	);
	testBadInput(
		'invalid lastStationId',
		{ lastStationId: 'foo' },
		'lastStationId: foo is not a valid universalId'
	);
	testBadInput(
		'no timezone',
		{ ...alice, timezone: null },
		'Path `timezone` is required'
	);
	testBadInput(
		'invalid timezone',
		{ timezone: 'foo' },
		'timezone: `foo` is not a valid enum value for path `timezone`'
	);
	testBadInput(
		'no email',
		{ emailReport: { email: null } },
		'emailReport.email: Path `email` is required'
	);
	testBadInput(
		'bad email',
		{ emailReport: { email: 'foo' } },
		'emailReport.email: Please enter a valid email'
	);
	testBadInput(
		'wrong email frequency',
		{ emailReport: { frequency: 'foo' } },
		'emailReport.frequency: `foo` is not a valid enum value for path `frequency`'
	);
	testGoodInput('change emailReport frequency', {
		emailReport: { frequency: 'monthly' },
	});
	testBadInput(
		'no emailReport',
		{
			emailReport: { email: null },
		},
		'Path `email` is required'
	);
	testBadInput(
		'no expoPushToken',
		{
			expoReport: { expoPushToken: null },
		},
		'expoReport.expoPushToken: Path `expoPushToken` is required'
	);
	testBadInput(
		'wrong expo frequency',
		{ expoReport: { frequency: 'foo' } },
		'expoReport.frequency: `foo` is not a valid enum value for path `frequency`'
	);
	testGoodInput('change expoReport frequency', {
		expoReport: { frequency: 'monthly' },
	});
	testGoodInput('no expoReport', {
		expoReport: null,
	});

	testBadInput(
		'duplicate expoPushToken',
		{
			expoReport: { expoPushToken: bob.expoReport.expoPushToken },
		},
		'E11000 duplicate key error collection: shootismoke.users index: expoReport.expoPushToken_1 dup key'
	);

	testBadInput(
		'duplicate email',
		{
			emailReport: { email: bob.emailReport.email },
		},
		'E11000 duplicate key error collection: shootismoke.users index: emailReport.email_1 dup key'
	);

	afterAll(() => connection.close());
});
