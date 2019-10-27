import { Document, model, Schema } from 'mongoose';

export interface UserType extends Document {
  expoInstallationId: string;
  expoPushToken: string;
}

const UserSchema = new Schema({
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
  expoPushToken: { required: true, type: String, unique: true }
  // history: t.union([t.array(HistoryItem), t.undefined])
});

export const User = model<UserType>('User', UserSchema);
