import { describeApollo } from '../../util';
import { CREATE_USER } from './gql';

const ALICE = {
  expoInstallationId: 'id_alice'
};
const BOB = {
  expoInstallationId: 'id_bob'
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
      'Variable "$input" got invalid value {}; Field expoInstallationId of required type ID! was not provided.'
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

  it('should be idempotent', async done => {
    const { mutate } = await client;

    const res1 = await mutate({
      mutation: CREATE_USER,
      variables: { input: BOB }
    });
    const res2 = await mutate({
      mutation: CREATE_USER,
      variables: { input: BOB }
    });

    if (!res1.data || !res2.data) {
      console.error(res1, res2);
      return done.fail('No data in response');
    }

    expect(res1.data.createUser._id).toBe(res2.data.createUser._id);

    done();
  });
});
