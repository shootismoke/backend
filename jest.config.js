/* eslint-disable */

const jestMongoDb = require('@shelf/jest-mongodb/jest-preset');
const tsJest = require('ts-jest/jest-preset');

module.exports = {
  ...tsJest,
  ...jestMongoDb,
  collectCoverageFrom: [
    '**/src/**/*.ts',
    '!**/index.ts', // index.ts only re-exports stuff
    '!**/testUtil.ts' // These files are used in tests
  ],
  setupFiles: ['./test/util/setup.ts'],
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts']
};
