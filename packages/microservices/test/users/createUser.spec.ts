import { describeApollo } from '../util';
import { CREATE_USER } from './gql';

const USER1 = {
  expoInstallationId: 'id1',
  expoPushToken: 'token1',
  notifications: { frequency: 'weekly' }
};
const USER2 = {
  expoInstallationId: 'id2',
  expoPushToken: 'token1' // Same token as USER1
};
const USER3 = {
  expoInstallationId: 'id3'
};

describeApollo('users::createUser', client => {
  it('should always require input', async done => {
    const { mutate } = await client;

    const res = await mutate({
      mutation: CREATE_USER,
      variables: {}
    });

    expect(res.errors && res.errors[0].message).toContain(
      'Variable "$input" of required type "CreateUserInput!" was not provided.'
    );

    done();
  });

  it('should require expoInstallationId', async done => {
    const { mutate } = await client;

    const res = await mutate({
      mutation: CREATE_USER,
      variables: { input: {} }
    });

    expect(res.errors && res.errors[0].message).toContain(
      'Variable "$input" got invalid value {}; Field expoInstallationId of required type String! was not provided.'
    );

    done();
  });

  it('should create a user', async done => {
    const { mutate } = await client;

    const res = await mutate({
      mutation: CREATE_USER,
      variables: { input: USER1 }
    });

    if (!res.data) {
      console.error(res);
      return done.fail('No data in response');
    }

    expect(res.data.createUser._id).toBeDefined();
    expect(res.data.createUser).toMatchObject(USER1);

    done();
  });

  it('should validate unique expoPushToken', async done => {
    // Empirically, we need a little bit of time after the previous test, so
    // that the value gets correctly inserted
    await new Promise(resolve => setTimeout(resolve, 50));

    const { mutate } = await client;

    const res = await mutate({
      mutation: CREATE_USER,
      variables: { input: USER2 }
    });

    expect(res.errors && res.errors[0].message).toContain(
      'E11000 duplicate key error'
    );

    done();
  });

  it("should be create 'never' notifications by default, and allow no expoPushToken", async done => {
    const { mutate } = await client;

    const res = await mutate({
      mutation: CREATE_USER,
      variables: { input: USER3 }
    });

    if (!res.data) {
      console.error(res);
      return done.fail('No data in response');
    }

    expect(res.data.createUser.notifications.frequency).toBe('never');

    done();
  });

  it('should be idempotent', async done => {
    const { mutate } = await client;

    const res1 = await mutate({
      mutation: CREATE_USER,
      variables: { input: USER3 }
    });
    const res2 = await mutate({
      mutation: CREATE_USER,
      variables: { input: USER3 }
    });

    if (!res1.data || !res2.data) {
      console.error(res1, res2);
      return done.fail('No data in response');
    }

    expect(res1.data.createUser._id).toBe(res2.data.createUser._id);

    done();
  });
});
