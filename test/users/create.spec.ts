import axios, { AxiosResponse } from 'axios';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function post<T>(data: any): Promise<AxiosResponse<T>> {
  return axios.post('http://localhost:3000/api/users', data);
}

const FAKE_ID = 'fakeId';
const FAKE_TOKEN = 'fakeToken';
const BASE_USER = {
  expoInstallationId: FAKE_ID,
  expoPushToken: FAKE_TOKEN
};

describe('users::create', () => {
  it('should return an error with empty', async () => {
    expect.assertions(1);
    try {
      await post({});
    } catch (e) {
      expect(e.response.status).toBe(422);
    }
  });

  it('should return an error without `expoInstallationId`', async () => {
    expect.assertions(1);
    try {
      await post({
        expoInstallationId: FAKE_ID
      });
    } catch (e) {
      expect(e.response.status).toBe(422);
    }
  });

  it('should return an error with without `expoPushToken`', async () => {
    expect.assertions(1);
    try {
      await post({
        expoPushToken: 'fakeToken'
      });
    } catch (e) {
      expect(e.response.status).toBe(422);
    }
  });

  it('should return 200 with the resource on successful creation', async () => {
    const { data, status } = await post({
      expoInstallationId: FAKE_ID,
      expoPushToken: FAKE_TOKEN
    });

    expect(status).toBe(200);
    expect(data).toMatchObject(BASE_USER);
  });

  it('should return 200 upon multiple calls on the same endpoint', async () => {
    const { data, status } = await post({
      expoInstallationId: FAKE_ID,
      expoPushToken: FAKE_TOKEN
    });

    expect(status).toBe(200);
    expect(data).toMatchObject(BASE_USER);
  });
});
