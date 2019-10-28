import { Document, model, Schema } from 'mongoose';

import { HistoryType } from './history';

export interface UserType extends Document {
  expoInstallationId: string;
  expoPushToken: string;
  history: HistoryType[];
}

export const UserSchema = new Schema({
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
  expoPushToken: { required: true, type: String, unique: true },
  /**
   * A user's history of visited stations
   */
  history: [
    {
      ref: 'History',
      type: Schema.Types.ObjectId
    }
  ]
});

export const User = model<UserType>('User', UserSchema);
