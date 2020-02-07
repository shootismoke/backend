import { describeApollo } from '../util';
import { CREATE_USER } from './gql';

const ALICE = {
  expoInstallationId: 'id1',
  expoPushToken: 'token1',
  lastStation: 'openaq|FR04101',
  notifications: { frequency: 'weekly' }
};
const BOB = {
  expoInstallationId: 'id2',
  expoPushToken: 'token1', // Same token as ALICE
  lastStation: 'openaq|FR04101'
};
const CHARLIE = {
  expoInstallationId: 'id3',
  lastStation: 'openaq|FR04101'
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

  it('should require lastStation', async done => {
    const { mutate } = await client;

    const res = await mutate({
      mutation: CREATE_USER,
      variables: { input: { ...ALICE, lastStation: undefined } }
    });

    expect(res.errors && res.errors[0].message).toContain(
      'Variable "$input" got invalid value { expoInstallationId: "id1", expoPushToken: "token1", lastStation: undefined, notifications: { frequency: "weekly" } }; Field lastStation of required type String! was not provided.'
    );

    done();
  });

  it('should require well-formed lastStation', async done => {
    const { mutate } = await client;

    const res = await mutate({
      mutation: CREATE_USER,
      variables: { input: { ...ALICE, lastStation: 'foo' } }
    });

    expect(res.errors && res.errors[0].message).toContain(
      'User validation failed: lastStation: foo is not a valid universalId'
    );

    done();
  });

  it('should create a user', async done => {
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
      variables: { input: BOB }
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
      variables: { input: CHARLIE }
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
      variables: { input: CHARLIE }
    });
    const res2 = await mutate({
      mutation: CREATE_USER,
      variables: { input: CHARLIE }
    });

    if (!res1.data || !res2.data) {
      console.error(res1, res2);
      return done.fail('No data in response');
    }

    expect(res1.data.createUser._id).toBe(res2.data.createUser._id);

    done();
  });
});
