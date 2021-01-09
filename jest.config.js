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
	moduleNameMapper: {
		'@shootismoke/convert$': '<rootDir>/packages/convert/src/index.ts',
		'@shootismoke/dataproviders$':
			'<rootDir>/packages/dataproviders/src/index.ts',
		'@shootismoke/types$': '<rootDir>/packages/types/src/index.ts',
		'@shootismoke/ui$': '<rootDir>/packages/ui/src/index.ts',
	},
	setupFiles: ['./packages/backend/test/util/setup.ts'],
	testEnvironment: 'node',
	testMatch: ['**/*.spec.ts'],
};
