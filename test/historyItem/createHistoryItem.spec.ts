import { openaq } from '@shootismoke/dataproviders/lib/promise';

import { describeApollo, getAlice } from '../util';
import { CREATE_HISTORY_ITEM } from './gql';

const OPENAQ_REAL_STATION = 'FR04101';

describeApollo('historyItem::createHistoryItem', client => {
  it('should only allow known providers', async done => {
    const { mutate } = await client;

    const [measurement] = openaq.normalizeByStation(
      await openaq.fetchByStation(OPENAQ_REAL_STATION)
    );

    const input = {
      measurement: {
        ...measurement,
        location: 'foo|bar' // Change location to something dummy
      },
      userId: (await getAlice(client))._id
    };

    const res = await mutate({
      mutation: CREATE_HISTORY_ITEM,
      variables: { input }
    });

    expect(res.errors && res.errors[0].message).toContain(
      'Only providers ["aqicn","openaq","waqi"] are supported for now'
    );

    done();
  });

  it('should create a history item', async done => {
    const { mutate } = await client;

    const [measurement] = openaq.normalizeByStation(
      await openaq.fetchByStation(OPENAQ_REAL_STATION)
    );

    const input = { measurement, userId: (await getAlice(client))._id };
    const res = await mutate({
      mutation: CREATE_HISTORY_ITEM,
      variables: { input }
    });

    if (!res.data) {
      console.error(res);
      return done.fail('No data in response');
    }

    expect(res.data.createHistoryItem).toBe(true);

    done();
  });

  it('can create twice the same history item', async done => {
    const { mutate } = await client;

    const [measurement] = openaq.normalizeByStation(
      await openaq.fetchByStation(OPENAQ_REAL_STATION)
    );

    const input = { measurement, userId: (await getAlice(client))._id };
    const res = await mutate({
      mutation: CREATE_HISTORY_ITEM,
      variables: { input }
    });

    if (!res.data) {
      console.error(res);
      return done.fail('No data in response');
    }

    expect(res.data.createHistoryItem).toBe(true);

    done();
  });
});
