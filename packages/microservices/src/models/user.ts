import { User as IUser } from '@shootismoke/graphql/src';
import { Document, model, Schema } from 'mongoose';

const FREQUENCY = ['never', 'daily', 'weekly', 'monthly'] as const;

const NotificationsSchema = new Schema({
  frequency: {
    default: 'never',
    enum: FREQUENCY,
    required: true,
    type: Schema.Types.String
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
