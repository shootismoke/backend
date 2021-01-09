const base = require('../../typedoc');

module.exports = {
	...base,
	exclude: [
		...base.exclude,
		'**/fetchBy.ts',
		'**/normalize.ts',
		'**/validation.ts',
	],
};
