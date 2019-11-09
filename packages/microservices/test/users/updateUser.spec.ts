import { describeApollo } from '../util';
import { alice, bob } from '../util/users';
import { UPDATE_USER } from './gql';

const ALICE_1 = {
  expoPushToken: 'token_alice_1'
};
const ALICE_2 = {
  notifications: { frequency: 'monthly' }
};
const ALICE_3 = {
  expoInstallationId: 'id_alice_1'
};

describeApollo('users::updateUser', client => {
  it('should be able to change expoPushToken', async done => {
    const { mutate } = await client;

    const res = await mutate({
      mutation: UPDATE_USER,
      variables: { userId: (await alice(client))._id, input: ALICE_1 }
    });

    if (!res.data) {
      console.error(res);
      return done.fail('No data in response');
    }

    expect(res.data.updateUser).toMatchObject(ALICE_1);

    done();
  });

  it('should be able to change notifications', async done => {
    const { mutate } = await client;

    const res = await mutate({
      mutation: UPDATE_USER,
      variables: { userId: (await alice(client))._id, input: ALICE_2 }
    });

    if (!res.data) {
      console.error(res);
      return done.fail('No data in response');
    }

    expect(res.data.updateUser).toMatchObject(ALICE_2);

    done();
  });

  it('should be able to change expoInstallationId', async done => {
    const { mutate } = await client;

    const res = await mutate({
      mutation: UPDATE_USER,
      variables: { userId: (await alice(client))._id, input: ALICE_3 }
    });

    if (!res.data) {
      console.error(res);
      return done.fail('No data in response');
    }

    expect(res.data.updateUser).toMatchObject(ALICE_3);

    done();
  });

  it('should validate unique expoPushToken', async done => {
    const { mutate } = await client;

    const res = await mutate({
      mutation: UPDATE_USER,
      variables: { userId: (await bob(client))._id, input: ALICE_1 }
    });

    expect(res.errors && res.errors[0].message).toContain(
      'E11000 duplicate key error'
    );

    done();
  });
});
