/* eslint-disable */

const jestMongoDb = require('@shelf/jest-mongodb/jest-preset');
const tsJest = require('ts-jest/jest-preset');

module.exports = {
  ...tsJest,
  ...jestMongoDb,
  setupFiles: ['./test/util/setup.ts'],
  testEnvironment: 'node'
};
