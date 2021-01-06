import axios, { AxiosError } from 'axios';
import { connection } from 'mongoose';

import { IUser } from '../src/models';
import { connectToDatabase } from '../src/util';

interface BackendError {
	error: string;
}

const BACKEND_URL = 'http://localhost:3000';

const user1 = {
	emailReport: {
		email: 'user1@example.org',
		frequency: 'daily',
	},
	expoReport: {
		expoPushToken: '1234',
		frequency: 'weekly',
	},
	lastStationId: 'openaq|FR04143',
	timezone: 'America/Los_Angeles',
};

describe('users::createUser', () => {
	beforeAll(async () => {
		await connectToDatabase();
		await connection.dropDatabase();
	});

	function testBadInput<T>(name: string, input: T, expErr: string) {
		it(`should require correct input: ${name}`, async (done) => {
			try {
				await axios.post(`${BACKEND_URL}/api/users`, input);
				done.fail();
			} catch (err) {
				const e = err as AxiosError<BackendError>;
				expect(e.response?.status).toBe(400);
				expect(e.response?.data.error).toContain(expErr);
				done();
			}
		});
	}

	testBadInput('empty input', {}, 'User validation failed');
	testBadInput(
		'no lastStationId',
		{ ...user1, lastStationId: undefined },
		'Path `lastStationId` is required'
	);
	testBadInput(
		'invalid lastStationId',
		{ ...user1, lastStationId: 'foo' },
		'lastStationId: foo is not a valid universalId'
	);
	testBadInput(
		'no timezone',
		{ ...user1, timezone: undefined },
		'Path `timezone` is required'
	);
	testBadInput(
		'invalid timezone',
		{ ...user1, timezone: 'foo' },
		'timezone: `foo` is not a valid enum value for path `timezone`'
	);
	testBadInput(
		'no email',
		{ ...user1, emailReport: { ...user1.emailReport, email: undefined } },
		'emailReport.email: Path `email` is required'
	);
	testBadInput(
		'bad email',
		{ ...user1, emailReport: { ...user1.emailReport, email: 'foo' } },
		'emailReport.email: Please enter a valid email'
	);
	testBadInput(
		'wrong email frequency',
		{ ...user1, emailReport: { ...user1.emailReport, frequency: 'foo' } },
		'emailReport.frequency: `foo` is not a valid enum value for path `frequency`'
	);
	testBadInput(
		'no expoPushToken',
		{
			...user1,
			expoReport: { ...user1.expoReport, expoPushToken: undefined },
		},
		'expoReport.expoPushToken: Path `expoPushToken` is required'
	);
	testBadInput(
		'wrong expo frequency',
		{ ...user1, expoReport: { ...user1.expoReport, frequency: 'foo' } },
		'expoReport.frequency: `foo` is not a valid enum value for path `frequency`'
	);

	it('should create a user', async () => {
		const { data } = await axios.post<IUser>(
			`${BACKEND_URL}/api/users`,
			user1
		);
		expect(data._id).toBeTruthy();
		expect(data).toMatchObject(user1);
	});

	testBadInput(
		'duplicate expoPushToken',
		user1,
		'E11000 duplicate key error collection: shootismoke.users index: expoReport.expoPushToken_1 dup key'
	);

	testBadInput(
		'duplicate email',
		{ ...user1, expoReport: undefined },
		'E11000 duplicate key error collection: shootismoke.users index: emailReport.email_1 dup key'
	);
});
