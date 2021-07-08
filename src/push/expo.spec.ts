import { User } from '@shootismoke/graphql';
import Expo, { ExpoPushMessage } from 'expo-server-sdk';
import { Document } from 'mongoose';

import {
	constructExpoMessage,
	handleReceipts,
	isPromiseFulfilled,
	isPromiseRejected,
	sendBatchToExpo,
} from './expo';

describe('Promise.allSettled', () => {
	it('should work with a fulfilled Promise', () => {
		const p = {
			status: 'fulfilled' as const,
			value: 2,
		};
		expect(isPromiseFulfilled(p)).toBe(true);
		expect(isPromiseRejected(p)).toBe(false);
	});

	it('should work with a rejected Promise', () => {
		const p = {
			status: 'rejected' as const,
			reason: 'foo',
		};
		expect(isPromiseFulfilled(p)).toBe(false);
		expect(isPromiseRejected(p)).toBe(true);
	});
});

describe('constructExpoMessage', () => {
	const user = {
		_id: 'alice',
		expoInstallationId: 'id_alice',
		notifications: {
			expoPushToken: 'ExponentPushToken[0zK3-xM3PgLEfe31-AafjB]', // real one, unused
			frequency: 'daily',
			timezone: 'Europe/Berlin',
			universalId: 'openaq|FR04143',
		},
	} as unknown as User & Document;

	it('should return Error on wrong notifications', () => {
		expect(() =>
			constructExpoMessage(
				{ ...user, notifications: undefined } as unknown as User &
					Document,
				42
			)
		).toThrowError(
			new Error('User alice has notifications, as per our db query. qed.')
		);
	});

	it('should return Error on wrong notifications', () => {
		expect(() =>
			constructExpoMessage(
				{
					...user,
					notifications: {
						...user.notifications,
						expoPushToken: 'foo',
					},
				} as unknown as User & Document,
				42
			)
		).toThrowError(new Error('Invalid ExpoPushToken: foo'));
	});

	it('should work for daily', () => {
		expect(constructExpoMessage(user, 42)).toEqual({
			body: "Shoot! You'll smoke 1.9 cigarettes today",
			sound: 'default',
			title: 'Daily forecast',
			to: 'ExponentPushToken[0zK3-xM3PgLEfe31-AafjB]',
		});
	});

	it('should work for weekly', () => {
		expect(
			constructExpoMessage(
				{
					...user,
					notifications: {
						...user.notifications,
						frequency: 'weekly',
					},
				} as unknown as User & Document,
				42
			)
		).toEqual({
			body: 'Shoot! You smoked 13.4 cigarettes in the past week.',
			sound: 'default',
			title: 'Weekly report',
			to: 'ExponentPushToken[0zK3-xM3PgLEfe31-AafjB]',
		});
	});

	it('should work for monthly', () => {
		expect(
			constructExpoMessage(
				{
					...user,
					notifications: {
						...user.notifications,
						frequency: 'monthly',
					},
				} as unknown as User & Document,
				42
			)
		).toEqual({
			body: 'Shoot! You smoked 57.3 cigarettes in the past month.',
			sound: 'default',
			title: 'Monthly report',
			to: 'ExponentPushToken[0zK3-xM3PgLEfe31-AafjB]',
		});
	});
});

describe('sendBatchToExpo', () => {
	it('should call sendPushNotificationsAsync', async (done) => {
		const expo = {
			chunkPushNotifications: jest.fn(<T>(a: T[]) =>
				a.map((value) => [value])
			),
			sendPushNotificationsAsync: jest.fn(() => Promise.resolve([])),
		} as unknown as Expo;

		const messages: ExpoPushMessage[] = [{ to: 'foo' }, { to: 'bar' }];
		await sendBatchToExpo(expo, messages);
		expect(expo.chunkPushNotifications).toBeCalledTimes(1); // eslint-disable-line @typescript-eslint/unbound-method
		expect(expo.sendPushNotificationsAsync).toBeCalledTimes(2); // eslint-disable-line @typescript-eslint/unbound-method

		done();
	});
});

describe('handleReceipts', () => {
	it('should correctly call onOk and onError', async (done) => {
		const receipts = {
			receiptA: { status: 'ok' },
			receiptB: { status: 'error', message: 'foo' },
		};
		const expo = {
			chunkPushNotificationReceiptIds: jest.fn(() => [
				Object.keys(receipts),
			]),
			getPushNotificationReceiptsAsync: jest.fn(() =>
				Promise.resolve(receipts)
			),
		} as unknown as Expo;
		const onOk = jest.fn();
		const onError = jest.fn();

		await handleReceipts(expo, Object.keys(receipts), onOk, onError);
		expect(onOk).toHaveBeenCalledTimes(1);
		expect(onError).toHaveBeenCalledTimes(1);

		done();
	});
});
