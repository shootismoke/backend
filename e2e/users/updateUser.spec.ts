import { ALICE_ID, BOB_ID, describeApollo, getAlice, getBob } from '../util';
import { UPDATE_USER } from './gql';

const ALICE_1 = {
  notifications: {
    expoPushToken: 'token_alice_1',
    frequency: 'monthly',
    timezone: 'America/Los_Angeles',
    universalId: 'openaq|FR04101'
  }
};
const ALICE_2 = {
  notifications: {
    expoPushToken: 'token_alice_2',
    frequency: 'never',
    timezone: 'Europe/Paris',
    universalId: 'openaq|FR04102'
  }
};
const BOB = {
  notifications: {
    expoPushToken: ALICE_2.notifications.expoPushToken, // Same token as ALICE_2
    frequency: 'monthly',
    timezone: 'Europe/Paris',
    universalId: 'openaq|FR04102'
  }
};

describeApollo('users::updateUser', client => {
  beforeAll(async done => {
    await getAlice(client);
    await getBob(client);

    done();
  });

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

    /**
     * Test that skipping a required field will yield an error.
     */
    function testRequiredField(field: string, graphqlType: string): void {
      it(`should require ${field}`, async done => {
        const { mutate } = await client;

        const res = await mutate({
          mutation: UPDATE_USER,
          variables: {
            expoInstallationId: ALICE_ID,
            input: {
              notifications: {
                ...ALICE_1.notifications,
                [field]: undefined
              }
            }
          }
        });

        expect(res.errors && res.errors[0].message).toContain(
          `Field ${field} of required type ${graphqlType} was not provided.`
        );

        done();
      });
    }

    testRequiredField('expoPushToken', 'ID!');
    testRequiredField('frequency', 'Frequency!');
    testRequiredField('timezone', 'String!');
    testRequiredField('universalId', 'String!');

    it('should require well-formed universalId', async done => {
      const { mutate } = await client;

      const res = await mutate({
        mutation: UPDATE_USER,
        variables: {
          expoInstallationId: ALICE_ID,
          input: {
            notifications: {
              ...ALICE_1.notifications,
              universalId: 'foo'
            }
          }
        }
      });

      expect(res.errors && res.errors[0].message).toContain(
        'User validation failed: notifications.universalId: foo is not a valid universalId, notifications: Validation failed: universalId: foo is not a valid universalId'
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

    console.log(res);

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
