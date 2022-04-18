module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
	},
	extends: ["@nuxtjs/eslint-config-typescript", "plugin:nuxt/recommended", "prettier"],
	plugins: ["prettier"],
	// add your custom rules here
	rules: {
		// Prettier formatting as ESLint errors, might override ESLint formatting rule
		"prettier/prettier": "error",
		"arrow-body-style": "off", // Turned off to prevent a bug with ESLint --fix
		"prefer-arrow-callback": "off", // Turned off to prevent a bug with ESLint --fix
		"vue/multi-word-component-names": "off", // Turned off component file name multi-word
	},
};
