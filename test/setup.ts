import { MONGO_TEST_DB } from './util/constants';

// Local DB
process.env.MONGODB_ATLAS_URI = MONGO_TEST_DB;

// Sometimes `now dev` needs a bit more time to install deps
jest.setTimeout(30000);
