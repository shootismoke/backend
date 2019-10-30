import { UserType } from '../../src/models';
import { CREATE_USER } from '../users/gql';
import { describeApollo } from '../util';
import { CREATE_HISTORY_ITEM } from './gql';

const USER1: Partial<UserType> = {
  expoInstallationId: 'id1'
};
const HISTORY1 = {
  provider: 'waqi',
  rawPm25: 1.1,
  stationId: 'station1'
};

describeApollo('historyItem::createHistoryItem', client => {
  /**
   * Test that missing required fields throw an error
   */
  function testRequiredFields(field: string): void {
    it(`should require ${field}`, async done => {
      const { mutate } = await client;
      const correctInput = { ...HISTORY1, userId: USER1._id };
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [field as keyof typeof correctInput]: removedValue,
        ...rest
      } = correctInput;

      const res = await mutate({
        mutation: CREATE_HISTORY_ITEM,
        variables: { input: { ...rest } }
      });

      expect(res.errors && res.errors[0].message).toContain(
        `Variable "$input" got invalid value `
      );
      expect(res.errors && res.errors[0].message).toContain(
        `Field ${field} of required type`
      );

      done();
    });
  }

  beforeAll(async done => {
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

    done();
  });

  (['provider', 'rawPm25', 'stationId', 'userId'] as const).forEach(
    testRequiredFields
  );

  it('should create a history item', async done => {
    const { mutate } = await client;

    const input = { ...HISTORY1, userId: USER1._id };
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

    const input = { ...HISTORY1, userId: USER1._id };
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
