import axios, { AxiosResponse } from 'axios';

import { BASE_URL } from '../util/constants';
import { describeMongo } from '../util/mongo';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function post<T>(data: any): Promise<AxiosResponse<T>> {
  return axios.post(`${BASE_URL}/api/users`, data);
}

const FAKE_ID = 'fakeId';
const FAKE_TOKEN = 'fakeToken';
const BASE_USER = {
  expoInstallationId: FAKE_ID,
  expoPushToken: FAKE_TOKEN
};

describeMongo('users::create', () => {
  it('should work', () => {
    expect(true).toBe(true);
  });

  it('should return an error with empty', async done => {
    try {
      await post({});
    } catch (e) {
      expect(e.response.status).toBe(422);
      done();
    }
  });

  it('should return an error without `expoInstallationId`', async done => {
    try {
      await post({
        expoInstallationId: FAKE_ID
      });
    } catch (e) {
      expect(e.response.status).toBe(422);
      done();
    }
  });

  it('should return an error with without `expoPushToken`', async done => {
    try {
      await post({
        expoPushToken: 'fakeToken'
      });
    } catch (e) {
      expect(e.response.status).toBe(422);
      done();
    }
  });

  it('should return 200 with the resource on successful creation', async done => {
    const { data, status } = await post({
      expoInstallationId: FAKE_ID,
      expoPushToken: FAKE_TOKEN
    });

    expect(status).toBe(200);
    expect(data).toMatchObject(BASE_USER);
    done();
  });

  it('should return 200 upon multiple calls on the same endpoint', async done => {
    const { data, status } = await post({
      expoInstallationId: FAKE_ID,
      expoPushToken: FAKE_TOKEN
    });

    expect(status).toBe(200);
    expect(data).toMatchObject(BASE_USER);
    done();
  });
});
