import { Request, Response } from 'express';

import { whitelistIPMiddleware } from './cron';

describe('whitelisted', () => {
	it('should allow a correct ip', () => {
		const res = ({
			status: jest.fn(),
			send: jest.fn(),
			end: jest.fn(),
		} as unknown) as Response;
		const next = jest.fn();

		whitelistIPMiddleware(
			({
				headers: {
					'x-forwarded-for': '198.27.83.222',
				},
			} as unknown) as Request,
			res,
			next
		);

		expect(next).toHaveBeenCalledTimes(1);
	});

	it('should block an empty', () => {
		const res = ({
			status: jest.fn(),
			send: jest.fn(),
			end: jest.fn(),
		} as unknown) as Response;
		const next = jest.fn();

		whitelistIPMiddleware(
			({
				headers: {},
			} as unknown) as Request,
			res,
			next
		);

		expect(res.status).toHaveBeenCalledWith(403); // eslint-disable-line @typescript-eslint/unbound-method
	});

	it('should whitelist a correct ip', () => {
		const res = ({
			status: jest.fn(),
			send: jest.fn(),
			end: jest.fn(),
		} as unknown) as Response;
		const next = jest.fn();

		whitelistIPMiddleware(
			({
				headers: {
					'x-forwarded-for': 'foo',
				},
			} as unknown) as Request,
			res,
			next
		);

		expect(res.status).toHaveBeenCalledWith(403); // eslint-disable-line @typescript-eslint/unbound-method
	});
});
