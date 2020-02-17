import { describeApollo, GET_OR_CREATE_USER } from '../../util';

const ALICE = {
  expoInstallationId: 'id_alice'
};
const BOB = {
  expoInstallationId: 'id_bob'
};

describeApollo('users::getOrCreateUser', client => {
  it('should always require input', async done => {
    const { mutate } = await client;

    const res = await mutate({
      mutation: GET_OR_CREATE_USER,
      variables: {}
    });

    expect(res.errors && res.errors[0].message).toBe(
      'Variable "$input" of required type "GetOrCreateUserInput!" was not provided.'
    );

    done();
  });

  it('should require expoInstallationId', async done => {
    const { mutate } = await client;

    const res = await mutate({
      mutation: GET_OR_CREATE_USER,
      variables: { input: {} }
    });

    expect(res.errors && res.errors[0].message).toBe(
      'Variable "$input" got invalid value {}; Field expoInstallationId of required type ID! was not provided.'
    );

    done();
  });

  it('should create a user', async done => {
    const { mutate } = await client;

    const res = await mutate({
      mutation: GET_OR_CREATE_USER,
      variables: { input: ALICE }
    });

    if (!res.data) {
      return done.fail('No data in response');
    }

    expect(res.data.getOrCreateUser._id).toBeDefined();
    expect(res.data.getOrCreateUser).toMatchObject(ALICE);

    done();
  });

  it('should be idempotent', async done => {
    const { mutate } = await client;

    const res1 = await mutate({
      mutation: GET_OR_CREATE_USER,
      variables: { input: BOB }
    });
    const res2 = await mutate({
      mutation: GET_OR_CREATE_USER,
      variables: { input: BOB }
    });

    if (!res1.data || !res2.data) {
      return done.fail('No data in response');
    }

    expect(res1.data.getOrCreateUser._id).toBe(res2.data.getOrCreateUser._id);

    done();
  });
});
