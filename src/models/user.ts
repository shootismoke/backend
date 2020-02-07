import { AllProviders } from '@shootismoke/dataproviders';
import { User as IUser } from '@shootismoke/graphql';
import { Document, model, Schema } from 'mongoose';

const FREQUENCY = ['never', 'daily', 'weekly', 'monthly'] as const;

const NotificationsSchema = new Schema({
  frequency: {
    default: 'never',
    enum: FREQUENCY,
    required: true,
    type: Schema.Types.String
  },
  /**
   * Station of the user to get the notifications. The value is an universalId,
   * e.g. `openaq|FR1012` or `aqicn|1047`. For privacy reasons, we do not store
   * the user's exact lat/lng.
   */
  station: {
    required: function(): boolean {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore Following docs: https://mongoosejs.com/docs/validation.html#built-in-validators
      return this.frequency !== 'never';
    },
    type: Schema.Types.String,
    validate: {
      message: ({ value }): string => `${value} is not a valid universalId`,
      validator: (station: string): boolean => {
        const [provider, id] = station.split('|');

        return !!id && AllProviders.includes(provider);
      }
    }
  }
});

export const UserSchema = new Schema(
  {
    /**
     * @see https://docs.expo.io/versions/latest/sdk/constants/#constantsinstallationid
     */
    expoInstallationId: {
      index: true,
      required: true,
      type: Schema.Types.String,
      unique: true
    },
    /**
     * @see https://docs.expo.io/versions/latest/guides/push-notifications/
     */
    expoPushToken: { sparse: true, type: String, unique: true },
    notifications: {
      default: {
        frequency: 'never'
      },
      required: true,
      type: NotificationsSchema
    }
  },
  { strict: 'throw', timestamps: true }
);

export const User = model<IUser & Document>('User', UserSchema);
