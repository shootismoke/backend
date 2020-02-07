import { describeApollo } from '../util';
import { CREATE_USER } from './gql';

const ALICE = {
  expoInstallationId: 'id1',
  expoPushToken: 'token1',
  notifications: { frequency: 'weekly', station: 'openaq|FR04101' }
};
const BOB = {
  expoInstallationId: 'id2',
  expoPushToken: 'token2',
  notifications: { frequency: 'never' }
};
const CHARLIE = {
  expoInstallationId: 'id3',
  expoPushToken: 'token1' // Same token as ALICE
};
const DAVE = {
  expoInstallationId: 'id4'
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

  it('should require station if notifications is not `never`', async done => {
    const { mutate } = await client;

    const res = await mutate({
      mutation: CREATE_USER,
      variables: {
        input: {
          ...ALICE,
          notifications: { ...ALICE.notifications, station: undefined }
        }
      }
    });

    expect(res.errors && res.errors[0].message).toContain(
      'User validation failed: notifications.station: Path `station` is required., notifications: Validation failed: station: Path `station` is required.'
    );

    done();
  });

  it('should require well-formed station', async done => {
    const { mutate } = await client;

    const res = await mutate({
      mutation: CREATE_USER,
      variables: {
        input: {
          ...ALICE,
          notifications: { ...ALICE.notifications, station: 'foo' }
        }
      }
    });

    expect(res.errors && res.errors[0].message).toContain(
      'User validation failed: notifications.station: foo is not a valid universalId, notifications: Validation failed: station: foo is not a valid universalId'
    );

    done();
  });

  it('should create a user with `never` notifications', async done => {
    const { mutate } = await client;

    const res = await mutate({
      mutation: CREATE_USER,
      variables: { input: BOB }
    });

    if (!res.data) {
      console.error(res);
      return done.fail('No data in response');
    }

    expect(res.data.createUser._id).toBeDefined();
    expect(res.data.createUser).toMatchObject(BOB);

    done();
  });

  it('should create a user with `weekly` notifications', async done => {
    const { mutate } = await client;

    const res = await mutate({
      mutation: CREATE_USER,
      variables: { input: ALICE }
    });

    if (!res.data) {
      console.error(res);
      return done.fail('No data in response');
    }

    expect(res.data.createUser._id).toBeDefined();
    expect(res.data.createUser).toMatchObject(ALICE);

    done();
  });

  it('should validate unique expoPushToken', async done => {
    // Empirically, we need a little bit of time after the previous test, so
    // that the value gets correctly inserted
    await new Promise(resolve => setTimeout(resolve, 50));

    const { mutate } = await client;

    const res = await mutate({
      mutation: CREATE_USER,
      variables: { input: CHARLIE }
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
      variables: { input: DAVE }
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
      variables: { input: DAVE }
    });
    const res2 = await mutate({
      mutation: CREATE_USER,
      variables: { input: DAVE }
    });

    if (!res1.data || !res2.data) {
      console.error(res1, res2);
      return done.fail('No data in response');
    }

    expect(res1.data.createUser._id).toBe(res2.data.createUser._id);

    done();
  });
});
