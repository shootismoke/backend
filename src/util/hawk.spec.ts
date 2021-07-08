import Hawk from '@hapi/hawk';
import { AuthenticationError } from 'apollo-server-micro';
import { Request } from 'express';

import { hawk } from './hawk';

function createReq({
	crendentialsId,
	credentialsKey,
	timestamp = Math.round(new Date().getTime() / 1000),
}: {
	crendentialsId: string;
	credentialsKey: string;
	timestamp?: number;
}): Request {
	const { header } = Hawk.client.header(
		'http://example.com/resource/4?filter=a',
		'GET',
		{
			timestamp,
			nonce: 'Ygvqdz',
			credentials: {
				algorithm: 'sha256',
				id: crendentialsId,
				key: credentialsKey,
			},
		}
	);

	return {
		headers: {
			host: 'example.com',
			authorization: header,
		},
		method: 'GET',
		nonce: 'Ygvqdz',
		port: 80,
		url: '/resource/4?filter=a',
	} as unknown as Request;
}

describe('hawk', () => {
	it('should throw an error on invalid id', async (done) => {
		const req = createReq({ crendentialsId: 'foo', credentialsKey: 'bar' });

		try {
			await hawk(req);
		} catch (error) {
			expect(error).toEqual(
				new AuthenticationError('Hawk: Invalid Hawk id: foo')
			);
		}

		done();
	});

	it('should return "Unauthorized" on a plain request', async (done) => {
		const req = createReq({ crendentialsId: 'foo', credentialsKey: 'bar' });
		delete req.headers.authorization;

		try {
			await hawk(req);
		} catch (error) {
			expect(error).toEqual(
				new AuthenticationError('Hawk: Unauthorized')
			);
		}

		done();
	});

	it('should return "Stale timestamp" along with offset', async (done) => {
		const req = createReq({
			crendentialsId: 'shootismoke-development',
			credentialsKey: process.env.HAWK_KEY_1_5_0 as string,
			timestamp: Math.round(new Date().getTime() / 1000) - 5000, // Add a 5s offset
		});

		try {
			await hawk(req);
		} catch (error) {
			expect(error).toEqual(
				new AuthenticationError('Hawk: Stale timestamp')
			);

			expect(error.extensions).toMatchObject({
				ts: expect.any(Number),
				tsm: expect.any(String),
				error: 'Stale timestamp',
				code: 'UNAUTHENTICATED',
			});
		}

		done();
	});

	it('should work', async (done) => {
		const req = createReq({
			crendentialsId: 'shootismoke-development',
			credentialsKey: process.env.HAWK_KEY_1_5_0 as string,
		});

		const result = await hawk(req);

		expect(result.credentials).toMatchObject({
			algorithm: 'sha256',
			key: process.env.HAWK_KEY_1_5_0,
		});

		done();
	});
});
