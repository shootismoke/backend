import { connectToDatabase, getMongoClient } from '../../src/util';
import { MONGO_TEST_DB } from './constants';

/**
 * A jest `describe()`, but wrapped in a fresh mongo connection
 */
export function describeMongo(description: string, fn: () => void): void {
  describe(description, () => {
    beforeAll(async done => {
      const db = await connectToDatabase();
      await db.dropDatabase();

      done();
    });

    fn();

    afterAll(async done => {
      const client = await getMongoClient(MONGO_TEST_DB);

      await client.close();
      done();
    });
  });
}
