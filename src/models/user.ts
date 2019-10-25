import * as t from 'io-ts';

import { HistoryItem } from './history';

export const User = t.type({
  /**
   * @see https://docs.expo.io/versions/latest/sdk/constants/#constantsinstallationid
   */
  expoInstallationId: t.string,
  /**
   * @see https://docs.expo.io/versions/latest/guides/push-notifications/
   */
  expoPushToken: t.string,
  history: t.union([t.array(HistoryItem), t.undefined])
});

export type IUser = t.TypeOf<typeof User>;
