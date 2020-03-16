import { ALICE_ID, describeApollo, GET_USER, getAlice } from '../../util';

describeApollo('users::getUser', client => {
  beforeAll(async done => {
    await getAlice(client);

    done();
  });

  it('should always require input', async done => {
    const { query } = await client;

    const res = await query({
      query: GET_USER,
      variables: {
        expoInstallationId: 'foo'
      }
    });

    expect(res.data).toEqual({ getUser: null });

    done();
  });

  it('should always require input', async done => {
    const { query } = await client;
    const alice = await getAlice(client);

    const res = await query({
      query: GET_USER,
      variables: {
        expoInstallationId: ALICE_ID
      }
    });

    if (!res.data) {
      return done.fail('No data in response');
    }

    expect(res.data.getUser).toEqual(alice);

    done();
  });
});
