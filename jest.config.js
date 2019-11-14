/* eslint-disable */

const jestMongoDb = require('@shelf/jest-mongodb/jest-preset');
const tsJest = require('ts-jest/jest-preset');

module.exports = {
  ...tsJest,
  ...jestMongoDb,
  collectCoverageFrom: [
    '**/src/**/*.ts',
    '!./packages/graphql/**', // These files are generated
    '!**/index.ts', // index.ts only re-exports stuff
    '!**/testUtil.ts', // These files are used in tests
    '!./packages/microservices/**' // These files are hard to unit test
  ],
  setupFiles: ['./packages/microservices/test/util/setup.ts'],
  testEnvironment: 'node',
  testMatch: ['**/src/**/*spec.ts']
};
