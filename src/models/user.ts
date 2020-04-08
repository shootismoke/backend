import { AllProviders } from '@shootismoke/dataproviders';
import { User as IUser } from '@shootismoke/graphql';
import { Document, model, Schema } from 'mongoose';

const FREQUENCY = ['never', 'daily', 'weekly', 'monthly'] as const;

const NotificationsSchema = new Schema({
  /**
   * @see https://docs.expo.io/versions/latest/guides/push-notifications/
   */
  expoPushToken: {
    // For simplicity sake, we require even if frequency is `never`
    required: true,
    sparse: true,
    type: Schema.Types.String,
    unique: true,
  },
  /**
   * Frequency of notifications
   */
  frequency: {
    default: 'never',
    enum: FREQUENCY,
    required: true,
    type: Schema.Types.String,
  },
  /**
   * User's timezone
   */
  timezone: {
    required: true,
    type: Schema.Types.String,
  },
  /**
   * Station of the user to get the notifications. The value is an universalId,
   * e.g. `openaq|FR1012` or `aqicn|1047`. For privacy reasons, we do not store
   * the user's exact lat/lng.
   */
  universalId: {
    // For simplicity sake, we require even if frequency is `never`
    required: true,
    type: Schema.Types.String,
    validate: {
      message: ({ value }): string => `${value} is not a valid universalId`,
      validator: (universalId: string): boolean => {
        const [provider, station] = universalId.split('|');

        return !!station && AllProviders.includes(provider);
      },
    },
  },
});

const UserSchema = new Schema(
  {
    /**
     * @see https://docs.expo.io/versions/latest/sdk/constants/#constantsinstallationid
     */
    expoInstallationId: {
      index: true,
      required: true,
      type: Schema.Types.String,
      unique: true,
    },
    /**
     * User's notifications preferences.
     */
    notifications: {
      type: NotificationsSchema,
    },
  },
  { strict: 'throw', timestamps: true }
);

export const User = model<IUser & Document>('User', UserSchema);
