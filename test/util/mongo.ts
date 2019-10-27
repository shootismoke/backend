import { connectToDatabase, getMongoClient } from '../../src/util';
import { MONGO_TEST_DB } from './constants';

process.env.MONGODB_ATLAS_URI = MONGO_TEST_DB;

/**
 * A jest `describe()`, but wrapped in a fresh mongo connection
 */
export function describeMongo(description: string, fn: () => void): void {
  describe(description, () => {
    beforeAll(async done => {
      jest.setTimeout(30000);

      const db = await connectToDatabase();
      await db.dropDatabase();
      console.log(`Database ${MONGO_TEST_DB} dropped`);

      done();
    });

    fn();

    afterAll(async done => {
      jest.setTimeout(5000);

      const client = await getMongoClient();
      await client.close();

      done();
    });
  });
}
