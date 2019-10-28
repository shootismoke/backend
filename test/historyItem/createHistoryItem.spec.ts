import { UserType } from '../../src/models';
import { CREATE_USER } from '../users/gql';
import { describeApollo } from '../util';
import { CREATE_HISTORY_ITEM } from './gql';

const USER1: Partial<UserType> = {
  expoInstallationId: 'id1',
  expoPushToken: 'token1'
};
const HISTORY_1 = {
  rawPm25: 1,
  stationId: 'station1'
};

describeApollo('historyItem::createHistoryItem', client => {
  it('should create a history item', async done => {
    const { mutate } = await client;

    const createRes = await mutate({
      mutation: CREATE_USER,
      variables: { input: USER1 }
    });
    if (!createRes.data) {
      console.error(createRes);
      return done.fail('No data in response');
    }
    USER1._id = createRes.data.createUser._id;

    const input = { ...HISTORY_1, userId: USER1._id };
    const res = await mutate({
      mutation: CREATE_HISTORY_ITEM,
      variables: { input }
    });

    if (!res.data) {
      console.error(res);
      return done.fail('No data in response');
    }

    expect(res.data.createHistoryItem).toBe(true);

    done();
  });

  it('should can create twice the same history item', async done => {
    const { mutate } = await client;

    const input = { ...HISTORY_1, userId: USER1._id };
    const res = await mutate({
      mutation: CREATE_HISTORY_ITEM,
      variables: { input }
    });

    if (!res.data) {
      console.error(res);
      return done.fail('No data in response');
    }

    expect(res.data.createHistoryItem).toBe(true);

    done();
  });
});
