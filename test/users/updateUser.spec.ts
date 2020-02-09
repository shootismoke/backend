import { ALICE_ID, BOB_ID, describeApollo, getAlice, getBob } from '../util';
import { UPDATE_USER } from './gql';

const ALICE_1 = {
  notifications: {
    expoPushToken: 'token_alice_1',
    frequency: 'monthly',
    station: 'openaq|FR04101'
  }
};
const ALICE_2 = {
  notifications: {
    expoPushToken: 'token_alice_2',
    frequency: 'never',
    station: 'openaq|FR04102'
  }
};
const BOB = {
  notifications: {
    expoPushToken: ALICE_2.notifications.expoPushToken, // Samel token as ALICE_2
    frequency: 'monthly',
    station: 'openaq|FR04102'
  }
};

describeApollo('users::updateUser', client => {
  beforeAll(async done => {
    await getAlice(client);
    await getBob(client);

    done();
  });

  // FIXME ADD TEST NO/wrong expoInstallationId

  describe('notifications input validation', () => {
    it('should fail on wrong expoInstallationId', async done => {
      const { mutate } = await client;

      const res = await mutate({
        mutation: UPDATE_USER,
        variables: {
          expoInstallationId: 'foo',
          input: ALICE_1
        }
      });

      expect(res.errors && res.errors[0].message).toContain(
        'No user with expoInstallationId "foo" found'
      );

      done();
    });

    it('should require expoPushToken', async done => {
      const { mutate } = await client;

      const res = await mutate({
        mutation: UPDATE_USER,
        variables: {
          expoInstallationId: ALICE_ID,
          input: {
            notifications: {
              ...ALICE_1.notifications,
              expoPushToken: undefined
            }
          }
        }
      });

      expect(res.errors && res.errors[0].message).toContain(
        'Variable "$input" got invalid value { expoPushToken: undefined, frequency: "monthly", station: "openaq|FR04101" } at "input.notifications"; Field expoPushToken of required type ID! was not provided.'
      );

      done();
    });

    it('should require frequency', async done => {
      const { mutate } = await client;

      const res = await mutate({
        mutation: UPDATE_USER,
        variables: {
          expoInstallationId: ALICE_ID,
          input: {
            notifications: {
              ...ALICE_1.notifications,
              frequency: undefined
            }
          }
        }
      });

      expect(res.errors && res.errors[0].message).toContain(
        'Variable "$input" got invalid value { expoPushToken: "token_alice_1", frequency: undefined, station: "openaq|FR04101" } at "input.notifications"; Field frequency of required type Frequency! was not provided.'
      );

      done();
    });

    it('should require station', async done => {
      const { mutate } = await client;

      const res = await mutate({
        mutation: UPDATE_USER,
        variables: {
          expoInstallationId: ALICE_ID,
          input: {
            notifications: {
              ...ALICE_1.notifications,
              station: undefined
            }
          }
        }
      });

      expect(res.errors && res.errors[0].message).toContain(
        'Variable "$input" got invalid value { expoPushToken: "token_alice_1", frequency: "monthly", station: undefined } at "input.notifications"; Field station of required type String! was not provided.'
      );

      done();
    });

    it('should require well-formed station as universalId', async done => {
      const { mutate } = await client;

      const res = await mutate({
        mutation: UPDATE_USER,
        variables: {
          expoInstallationId: ALICE_ID,
          input: {
            notifications: {
              ...ALICE_1.notifications,
              station: 'foo'
            }
          }
        }
      });

      expect(res.errors && res.errors[0].message).toContain(
        'User validation failed: notifications.station: foo is not a valid universalId, notifications: Validation failed: station: foo is not a valid universalId'
      );

      done();
    });
  });

  it('should be able to create notifications', async done => {
    const { mutate } = await client;

    const res = await mutate({
      mutation: UPDATE_USER,
      variables: {
        expoInstallationId: ALICE_ID,
        input: ALICE_1
      }
    });

    if (!res.data) {
      console.error(res);
      return done.fail('No data in response');
    }

    expect(res.data.updateUser).toMatchObject(ALICE_1);

    done();
  });

  it('should be able to update notifications', async done => {
    const { mutate } = await client;

    const res = await mutate({
      mutation: UPDATE_USER,
      variables: {
        expoInstallationId: ALICE_ID,
        input: ALICE_2
      }
    });

    if (!res.data) {
      console.error(res);
      return done.fail('No data in response');
    }

    expect(res.data.updateUser).toMatchObject(ALICE_2);

    done();
  });

  it('should validate unique expoPushToken', async done => {
    const { mutate } = await client;

    const res = await mutate({
      mutation: UPDATE_USER,
      variables: {
        expoInstallationId: BOB_ID,
        input: BOB
      }
    });

    expect(res.errors && res.errors[0].message).toContain(
      'E11000 duplicate key error'
    );

    done();
  });
});
