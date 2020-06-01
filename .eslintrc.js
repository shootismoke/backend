module.exports = {
	...require('@amaurymartiny/eslintrc'),
	env: { node: true },
	// FIXME Turn these rules on again.
	rules: {
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
	},
};
