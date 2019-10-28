import { UserType } from '../../src/models';
import { describeApollo } from '../util';
import { CREATE_USER, UPDATE_USER } from './gql';

const USER1: Partial<UserType> = {
  expoInstallationId: 'id1',
  expoPushToken: 'token1'
};
const USER1_1 = {
  expoPushToken: 'token1.1'
};
const USER1_2 = {
  notifications: 'monthly'
};
const USER1_3 = {
  expoInstallationId: 'id1.1'
};

describeApollo('users::updateUser', client => {
  it('should be able to change expoPushToken', async done => {
    const { mutate } = await client;

    const createRes = await mutate({
      mutation: CREATE_USER,
      variables: { input: USER1 }
    });
    if (!createRes.data) {
      console.error(createRes);
      return done.fail('No data in response');
    }
    USER1._id = createRes.data.createUser._id;

    const res = await mutate({
      mutation: UPDATE_USER,
      variables: { id: USER1._id, input: USER1_1 }
    });

    if (!res.data) {
      console.error(res);
      return done.fail('No data in response');
    }

    expect(res.data.updateUser).toMatchObject(USER1_1);

    done();
  });

  it('should be able to change notifications', async done => {
    const { mutate } = await client;

    const res = await mutate({
      mutation: UPDATE_USER,
      variables: { id: USER1._id, input: USER1_2 }
    });

    if (!res.data) {
      console.error(res);
      return done.fail('No data in response');
    }

    expect(res.data.updateUser).toMatchObject(USER1_2);

    done();
  });

  it('should be able to change expoInstallationId', async done => {
    const { mutate } = await client;

    const res = await mutate({
      mutation: UPDATE_USER,
      variables: { id: USER1._id, input: USER1_3 }
    });

    if (!res.data) {
      console.error(res);
      return done.fail('No data in response');
    }

    expect(res.data.updateUser).toMatchObject(USER1_3);

    done();
  });

  // it('should add history on new user', async done => {
  //   const { mutate } = await client;

  //   const res = await mutate({
  //     mutation: CREATE_USER,
  //     variables: {input:USER4}
  //   });

  //   if (!res.data) {
  //     console.error(res);
  //     return done.fail('No data in response');
  //   }

  //   expect(res.data.createUser).toMatchObject(USER4);

  //   done();
  // });

  // it('should not add new history item with bad input (no stationId)', async done => {
  //   const USER4_HISTORY = {
  //     expoInstallationId: 'id4',
  //     history: [
  //       {
  //         rawPm25: 4
  //       }
  //     ]
  //   };

  //   const { mutate } = await client;

  //   const res = await mutate({
  //     mutation: CREATE_USER,
  //     variables: {input:USER4_HISTORY}
  //   });

  //   expect(res.errors && res.errors[0].message).toContain(
  //     'history validation failed: stationId: Path `stationId` is required.'
  //   );

  //   done();
  // });

  // it('should not add new history item with bad input (no rawPm25)', async done => {
  //   const USER4_HISTORY = {
  //     expoInstallationId: 'id4',
  //     history: [
  //       {
  //         stationId: 'station4'
  //       }
  //     ]
  //   };

  //   const { mutate } = await client;

  //   const res = await mutate({
  //     mutation: CREATE_USER,
  //     variables: {input:USER4_HISTORY}
  //   });

  //   expect(res.errors && res.errors[0].message).toContain(
  //     'history validation failed: rawPm25: Path `rawPm25` is required.'
  //   );

  //   done();
  // });

  // it('should add new history items on existing user', async done => {
  //   const USER4_HISTORY = {
  //     expoInstallationId: 'id4',
  //     history: [
  //       {
  //         rawPm25: 4,
  //         stationId: 'station4'
  //       }
  //     ]
  //   };

  //   const { mutate } = await client;

  //   const res = await mutate({
  //     mutation: CREATE_USER,
  //     variables: {input:USER4_HISTORY}
  //   });

  //   if (!res.data) {
  //     console.error(res);
  //     return done.fail('No data in response');
  //   }

  //   expect(res.data.createUser).toMatchObject({
  //     ...USER4,
  //     history: USER4.history.concat(USER4_HISTORY.history)
  //   });

  //   done();
  // });
});
