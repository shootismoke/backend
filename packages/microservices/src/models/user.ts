import { User as IUser } from '@shootismoke/graphql/src/types';
import { Document, model, Schema } from 'mongoose';

const NOTIFICATIONS = ['never', 'daily', 'weekly', 'monthly'] as const;

export const UserSchema = new Schema(
  {
    /**
     * @see https://docs.expo.io/versions/latest/sdk/constants/#constantsinstallationid
     */
    expoInstallationId: {
      index: true,
      required: true,
      type: String,
      unique: true
    },
    /**
     * @see https://docs.expo.io/versions/latest/guides/push-notifications/
     */
    expoPushToken: { type: String, unique: true },
    /**
     * A user's history of visited stations
     */
    history: [
      {
        ref: 'HistoryItem',
        type: Schema.Types.ObjectId
      }
    ],
    notifications: {
      default: 'never',
      enum: NOTIFICATIONS,
      required: true,
      type: String
    }
  },
  { strict: 'throw' }
);

export const User = model<IUser & Document>('User', UserSchema);
