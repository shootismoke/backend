import { describeApollo, getAlice, getBob } from '../util';
import { UPDATE_USER } from './gql';

const ALICE_1 = {
  expoPushToken: 'token_alice_1'
};
const ALICE_2 = {
  notifications: { frequency: 'monthly', station: 'openaq|FR04101' }
};
const ALICE_3 = {
  notifications: { frequency: 'weekly', station: 'openaq|FR04102' }
};
const ALICE_4 = {
  notifications: { frequency: 'never' }
};
const ALICE_5 = {
  expoInstallationId: 'id_alice_1'
};

describeApollo('users::updateUser', client => {
  it('should be able to change expoPushToken', async done => {
    const { mutate } = await client;

    const res = await mutate({
      mutation: UPDATE_USER,
      variables: { userId: (await getAlice(client))._id, input: ALICE_1 }
    });

    if (!res.data) {
      console.error(res);
      return done.fail('No data in response');
    }

    expect(res.data.updateUser).toMatchObject(ALICE_1);

    done();
  });

  it('should be able to create notifications', async done => {
    const { mutate } = await client;

    const res = await mutate({
      mutation: UPDATE_USER,
      variables: { userId: (await getAlice(client))._id, input: ALICE_2 }
    });

    if (!res.data) {
      console.error(res);
      return done.fail('No data in response');
    }

    expect(res.data.updateUser).toMatchObject(ALICE_2);

    done();
  });

  it('should be able to update notifications to never', async done => {
    const { mutate } = await client;

    const res = await mutate({
      mutation: UPDATE_USER,
      variables: { userId: (await getAlice(client))._id, input: ALICE_4 }
    });

    if (!res.data) {
      console.error(res);
      return done.fail('No data in response');
    }

    expect(res.data.updateUser).toMatchObject(ALICE_4);

    done();
  });

  it('should not be able to update weekly notifications without station', async done => {
    const { mutate } = await client;

    const res = await mutate({
      mutation: UPDATE_USER,
      variables: {
        userId: (await getAlice(client))._id,
        input: {
          ...ALICE_3,
          notifications: { ...ALICE_3.notifications, station: undefined }
        }
      }
    });

    expect(res.errors && res.errors[0].message).toContain(
      'User validation failed: notifications.station: Path `station` is required., notifications: Validation failed: station: Path `station` is required.'
    );

    done();
  });

  it('should be able to update notifications to weekly', async done => {
    const { mutate } = await client;

    const res = await mutate({
      mutation: UPDATE_USER,
      variables: { userId: (await getAlice(client))._id, input: ALICE_3 }
    });

    if (!res.data) {
      console.error(res);
      return done.fail('No data in response');
    }

    expect(res.data.updateUser).toMatchObject(ALICE_3);

    done();
  });

  it('should be able to change expoInstallationId', async done => {
    const { mutate } = await client;

    const res = await mutate({
      mutation: UPDATE_USER,
      variables: { userId: (await getAlice(client))._id, input: ALICE_5 }
    });

    if (!res.data) {
      console.error(res);
      return done.fail('No data in response');
    }

    expect(res.data.updateUser).toMatchObject(ALICE_5);

    done();
  });

  it('should validate unique expoPushToken', async done => {
    const { mutate } = await client;

    const res = await mutate({
      mutation: UPDATE_USER,
      variables: { userId: (await getBob(client))._id, input: ALICE_1 }
    });

    expect(res.errors && res.errors[0].message).toContain(
      'E11000 duplicate key error'
    );

    done();
  });
});
