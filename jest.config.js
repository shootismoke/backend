/* eslint-disable */

const tsJest = require('ts-jest/jest-preset');

module.exports = {
	...tsJest,
	collectCoverageFrom: [
		'**/api/**/*.ts',
		'**/src/**/*.ts',
		'!**/index.ts', // index.ts only re-exports stuff
		'!**/testUtil.ts', // These files are used in tests
	],
	setupFiles: ['./packages/backend/e2e/util/setup.ts'],
	testEnvironment: 'node',
	testMatch: ['**/*.spec.ts'],
};
