import { AllProviders } from '@shootismoke/dataproviders';
import { timeZonesNames } from '@vvo/tzdb';
import { Document, model, Schema } from 'mongoose';

const FREQUENCY = ['never', 'daily', 'weekly', 'monthly'];

export interface IEmailReport {
	_id: string;
	email: string;
	frequency: typeof FREQUENCY;
}

const EmailReportSchema = new Schema({
	/**
	 * Email to send the report too.
	 */
	email: {
		required: true,
		sparse: true,
		type: Schema.Types.String,
		unique: true,
		validate: {
			validator: (v: string) => {
				return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v); // eslint-disable-line no-useless-escape
			},
			message: 'Please enter a valid email',
		},
	},
	/**
	 * Frequency of reports.
	 */
	frequency: {
		default: 'never',
		enum: FREQUENCY,
		required: true,
		type: Schema.Types.String,
	},
});

export interface IExpoReport {
	_id: string;
	expoPushToken: string;
	frequency: typeof FREQUENCY;
}

const ExpoReportSchema = new Schema({
	/**
	 * Token to send the push notification to.
	 *
	 * @see https://docs.expo.io/versions/latest/guides/push-notifications/
	 */
	expoPushToken: {
		required: true,
		sparse: true,
		type: Schema.Types.String,
		unique: true,
	},
	/**
	 * Frequency of reports.
	 */
	frequency: {
		default: 'never',
		enum: FREQUENCY,
		required: true,
		type: Schema.Types.String,
	},
});

export interface IUser {
	_id: string;
	emailReport?: IEmailReport;
	expoReport?: IExpoReport;
	lastStationId: string;
	timezone: string;
}

const UserSchema = new Schema(
	{
		/**
		 * User's timezone.
		 */
		timezone: {
			enum: timeZonesNames,
			required: true,
			type: Schema.Types.String,
		},
		/**
		 * Station of the user to get the notifications. The value is an universalId,
		 * e.g. `openaq|FR1012` or `aqicn|1047`. For privacy reasons, we do not store
		 * the user's exact lat/lng.
		 */
		lastStationId: {
			// For simplicity sake, we require even if frequency is `never`
			required: true,
			type: Schema.Types.String,
			validate: {
				message: ({ value }): string =>
					`${value as string} is not a valid universalId`,
				validator: (universalId: string): boolean => {
					const [provider, station] = universalId.split('|');

					return !!station && AllProviders.includes(provider);
				},
			},
		},
		/**
		 * User's Expo repots preferences.
		 */
		expoReport: {
			type: ExpoReportSchema,
		},
		/**
		 * User's email repots preferences.
		 */
		emailReport: {
			type: EmailReportSchema,
		},
	},
	{ strict: 'throw', timestamps: true }
);

export const User = model<Document<IUser>>('User', UserSchema);
