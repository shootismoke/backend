/* eslint-disable */

const jestMongoDb = require('@shelf/jest-mongodb/jest-preset');
const tsJest = require('ts-jest/jest-preset');

module.exports = {
  ...tsJest,
  ...jestMongoDb,
  collectCoverageFrom: ['**/src/**/*.ts', '!./packages/graphql/**'],
  setupFiles: ['./packages/microservices/test/util/setup.ts'],
  testEnvironment: 'node',
  testMatch: ['**/src/**/*spec.ts']
};
