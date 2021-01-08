import axios, { AxiosError } from 'axios';
import { connection } from 'mongoose';

import { BackendError } from '../../types/src/types';
import { IUser } from '../src/models';
import { connectToDatabase } from '../src/util';
import { alice, BACKEND_URL } from './util/testdata';

let dbAlice: IUser;

describe('users::getUser', () => {
	beforeAll(async (done) => {
		await connectToDatabase();
		await connection.dropDatabase();

		const { data } = await axios.post<IUser>(
			`${BACKEND_URL}/api/users`,
			alice
		);

		dbAlice = data;

		done();
	});

	it('should always require userId', async (done) => {
		try {
			await axios.get<IUser>(`${BACKEND_URL}/api/users`);
		} catch (err) {
			const e = err as AxiosError<BackendError>;
			expect(e.response?.status).toBe(405);
			expect(e.response?.data.error).toBe('Unknown request method: GET');
			done();
		}
	});

	it('should always fail if userId not found', async (done) => {
		try {
			await axios.get<IUser>(`${BACKEND_URL}/api/users/foo`);
		} catch (err) {
			const e = err as AxiosError<BackendError>;
			expect(e.response?.status).toBe(500);
			expect(e.response?.data.error).toContain(
				'Cast to ObjectId failed for value'
			);
			done();
		}
	});

	it('should fetch correct user', async (done) => {
		const { data } = await axios.get<IUser>(
			`${BACKEND_URL}/api/users/${dbAlice?._id}`
		);

		expect(data._id).toBe(dbAlice._id);
		expect(data).toMatchObject(dbAlice);

		done();
	});

	afterAll(() => connection.close());
});
