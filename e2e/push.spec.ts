import { NowRequest, NowResponse } from '@now/node';
import { ObjectID } from 'mongodb';

import { push } from '../api/push';
import { PushTicket } from '../src/models';
import { findTimezonesAt } from '../src/util';
import { ALICE_ID, describeApollo, getAlice, UPDATE_USER } from './util';

describeApollo('push', client => {
  beforeAll(async done => {
    jest.setTimeout(10000);

    await getAlice(client);

    // Find timezones that are at 9 o'clock now
    const timezones = findTimezonesAt(9, new Date());

    // Update Alice's timezone so that she'll get a notification right now
    const { mutate } = await client;
    await mutate({
      mutation: UPDATE_USER,
      variables: {
        expoInstallationId: ALICE_ID,
        input: {
          notifications: {
            expoPushToken: 'ExponentPushToken[0zK3-xM3PgLEfe31-AafjB]', // real one, unused
            frequency: 'daily',
            timezone: timezones[0],
            universalId: 'openaq|FR04002'
          }
        }
      }
    });

    done();
  });

  it('should correctly send push notifications', async done => {
    const req = {} as NowRequest;
    const res = ({
      send: jest.fn()
    } as unknown) as NowResponse;

    try {
      await push(req, res);

      // Check that the coorect tickets have been created
      const pushTickets = await PushTicket.find();
      const alice = await getAlice(client);
      expect(pushTickets.map(m => m.toJSON())).toMatchObject([
        {
          __v: 0,
          _id: expect.any(ObjectID),
          receiptId: 'foo',
          status: 'ok',
          userId: new ObjectID(alice._id),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date)
        }
      ]);

      done();
    } catch (error) {
      done.fail(error.message);
    }
  });

  afterAll(() => {
    jest.setTimeout(5000);
  });
});
