import { client, gql, reset, teardown } from '../util';

const GET_OR_CREATE_USER = gql`
  mutation getOrCreateUser(
    $expoInstallationId: String!
    $expoPushToken: String!
  ) {
    getOrCreateUser(
      expoInstallationId: $expoInstallationId
      expoPushToken: $expoPushToken
    ) {
      _id
      expoInstallationId
      expoPushToken
    }
  }
`;

describe('users::getOrCreateUser', () => {
  beforeAll(async done => {
    await reset();

    done();
  });

  it('should create a user', async done => {
    const BASE_USER = {
      expoInstallationId: '123',
      expoPushToken: '456'
    };

    const { mutate } = await client();

    const res = await mutate({
      mutation: GET_OR_CREATE_USER,
      variables: BASE_USER
    });

    if (!res.data) {
      return done.fail('No data in response');
    }

    expect(res.data.getOrCreateUser._id).toBeDefined();
    expect(res.data.getOrCreateUser).toMatchObject(BASE_USER);

    done();
  });

  it('should have unique expoPushToken', async done => {
    // Empirically, we need a little bit of time after the previous test, so
    // that the value gets correctly inserted
    await new Promise(resolve => setTimeout(resolve, 50));

    const BASE_USER = {
      expoInstallationId: '456',
      expoPushToken: '456'
    };

    const { mutate } = await client();

    const res = await mutate({
      mutation: GET_OR_CREATE_USER,
      variables: BASE_USER
    });

    expect(res.errors && res.errors[0].message).toBe(
      'E11000 duplicate key error collection: test.users index: expoPushToken_1 dup key: { expoPushToken: "456" }'
    );

    done();
  });

  it('should be idempotent', async done => {
    const BASE_USER = {
      expoInstallationId: 'fake_id',
      expoPushToken: 'fake_token'
    };

    const { mutate } = await client();

    const res1 = await mutate({
      mutation: GET_OR_CREATE_USER,
      variables: BASE_USER
    });
    const res2 = await mutate({
      mutation: GET_OR_CREATE_USER,
      variables: BASE_USER
    });

    if (!res1.data || !res2.data) {
      return done.fail('No data in response');
    }

    expect(res1.data.getOrCreateUser._id).toBe(res2.data.getOrCreateUser._id);

    done();
  });

  afterAll(async done => {
    await teardown();

    done();
  });
});
