import { client, gql, reset, teardown } from '../util';

const GET_OR_CREATE_USER = gql`
  mutation(
    $expoInstallationId: String!
    $expoPushToken: String!
    $history: [HistoryInput]
  ) {
    getOrCreateUser(
      expoInstallationId: $expoInstallationId
      expoPushToken: $expoPushToken
      history: $history
    ) {
      _id
      expoInstallationId
      expoPushToken
      history {
        rawPm25
        stationId
      }
    }
  }
`;

describe('users::getOrCreateUser', () => {
  beforeAll(async done => {
    await reset();

    done();
  });

  it('should create a user', async done => {
    const USER = {
      expoInstallationId: 'id1',
      expoPushToken: 'token1'
    };

    const { mutate } = await client();

    const res = await mutate({
      mutation: GET_OR_CREATE_USER,
      variables: USER
    });

    if (!res.data) {
      console.error(res);
      return done.fail('No data in response');
    }

    expect(res.data.getOrCreateUser._id).toBeDefined();
    expect(res.data.getOrCreateUser).toMatchObject(USER);

    done();
  });

  it('should have unique expoPushToken', async done => {
    // Empirically, we need a little bit of time after the previous test, so
    // that the value gets correctly inserted
    await new Promise(resolve => setTimeout(resolve, 50));

    const USER = {
      expoInstallationId: 'id2',
      expoPushToken: 'token1'
    };

    const { mutate } = await client();

    const res = await mutate({
      mutation: GET_OR_CREATE_USER,
      variables: USER
    });

    expect(res.errors && res.errors[0].message).toContain(
      'E11000 duplicate key error collection: test.users index: expoPushToken_1 dup key'
    );

    done();
  });

  it('should be idempotent', async done => {
    const USER = {
      expoInstallationId: 'id3',
      expoPushToken: 'token3'
    };

    const { mutate } = await client();

    const res1 = await mutate({
      mutation: GET_OR_CREATE_USER,
      variables: USER
    });
    const res2 = await mutate({
      mutation: GET_OR_CREATE_USER,
      variables: USER
    });

    if (!res1.data || !res2.data) {
      console.error(res1, res2);
      return done.fail('No data in response');
    }

    expect(res1.data.getOrCreateUser._id).toBe(res2.data.getOrCreateUser._id);

    done();
  });

  it('should add history on new user', async done => {
    const USER = {
      expoInstallationId: 'id4',
      expoPushToken: 'token4',
      history: [
        {
          rawPm25: 1,
          stationId: 'station1'
        },
        {
          rawPm25: 2,
          stationId: 'station2'
        }
      ]
    };

    const { mutate } = await client();

    const res = await mutate({
      mutation: GET_OR_CREATE_USER,
      variables: USER
    });

    if (!res.data) {
      console.error(res);
      return done.fail('No data in response');
    }

    expect(res.data.getOrCreateUser).toMatchObject(USER);

    done();
  });

  it('should add new history items on existing user', async done => {
    const USER = {
      expoInstallationId: 'id4',
      expoPushToken: 'token4',
      history: [
        {
          rawPm25: 3,
          stationId: 'station3'
        }
      ]
    };

    const { mutate } = await client();

    const res = await mutate({
      mutation: GET_OR_CREATE_USER,
      variables: USER
    });

    if (!res.data) {
      console.error(res);
      return done.fail('No data in response');
    }

    expect(res.data.getOrCreateUser).toMatchObject({
      ...USER,
      history: [
        {
          rawPm25: 1,
          stationId: 'station1'
        },
        {
          rawPm25: 2,
          stationId: 'station2'
        },
        {
          rawPm25: 3,
          stationId: 'station3'
        }
      ]
    });

    done();
  });

  afterAll(async done => {
    await teardown();

    done();
  });
});
