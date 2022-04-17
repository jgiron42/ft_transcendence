module.exports = {
	// Prevent checking every subdirectory for eslintrc files.
	root: true,

	env: {
		browser: true,
		node: true,
		es2021: true,
	},

	plugins: [
		// Prettier ESLint support, will make Prettier errors appear the same way as ESLint errors
		// Comes from package `eslint-plugin-prettier`
		"prettier",
	],

	extends: [
		"@nuxtjs",
		"plugin:prettier/recommended",
		"plugin:nuxt/recommended",

		// Prettier set, this will turn off ESLint formatting rules that Prettier already formats
		// Comes from `eslint-config-prettier`
		"prettier",
	],

	// add your custom rules here
	rules: {
		// Prettier formatting as ESLint errors, might override ESLint formatting rule
		"prettier/prettier": "error",
		"arrow-body-style": "off", // Turned off to prevent a bug with ESLint --fix
		"prefer-arrow-callback": "off", // Turned off to prevent a bug with ESLint --fix
		"vue/multi-word-component-names": "off", // Turned off component file name multi-word
	},
};
