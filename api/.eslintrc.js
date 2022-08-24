module.exports = {
	// Prevent checking every subdirectory for eslintrc files.
	root: true,

	// Tells ESLint to use the installed parser package (@typescript-eslint/parser). This allows ESLint to understand TypeScript syntax.
	parser: "@typescript-eslint/parser",

	parserOptions: {
		ecmaVersion: 2021,
		sourceType: "module",
		project: ["tsconfig.json"],
	},

	// Tells ESLint the version of ECMAScript allowed and the Node.js context
	env: {
		es2021: true,
		node: true
	},

	// Tells ESLint to load the installed @typescript-eslint/eslint-plugin package. This allows to use the rules within your codebase.
	plugins: [
		// ESLint typescript support
		"@typescript-eslint",

		// Import statements ESLint support
		"eslint-plugin-import",

		// Deeper arrow function ESLint support
		"eslint-plugin-prefer-arrow",

		// Prettier ESLint support, will make Prettier errors appear the same way as ESLint errors
		// Comes from package `eslint-plugin-prettier`
		"prettier",
	],

	// List of file patterns to ignore is defined via `ignorePatterns` but with the `.eslintignore` root file

	// Tells ESLint that your config extends the given configurations.
	extends: [
		// Default ESLint rule set
		"eslint:recommended",

		// Default TypeScript rule set
		"plugin:@typescript-eslint/recommended",

		// TypeScript rule set around type checking
		"plugin:@typescript-eslint/recommended-requiring-type-checking",

		// Prettier set, this will turn off ESLint formatting rules that Prettier already formats
		// Comes from `eslint-config-prettier`
		"prettier"
	],

	// ESLint rules to follow
	rules: {
		// Native semantic ESLint rules
		"complexity": "off",
		"constructor-super": "error",
		"dot-notation": "off",
		"eqeqeq": ["error", "smart"],
		"guard-for-in": "error",
		"id-blacklist": [
			"error",
			"any",
			"Number",
			"number",
			"String",
			"string",
			"Boolean",
			"boolean",
			"Undefined",
			"undefined"
		],
		"max-classes-per-file": ["error", 1],
		"no-bitwise": "error",
		"no-caller": "error",
		"no-cond-assign": "error",
		"no-console": "warn",
		"no-constant-condition": "error",
		"no-control-regex": "off",
		"no-debugger": "off",
		"no-empty": "error",
		"no-eval": "error",
		"no-fallthrough": "off",
		"no-invalid-regexp": "error",
		"no-invalid-this": "error",
		"no-irregular-whitespace": "error",
		"no-magic-numbers": "off",
		"no-new-wrappers": "error",
		"no-prototype-builtins": "off",
		"no-regex-spaces": "error",
		"no-sparse-arrays": "error",
		"no-throw-literal": "error",
		"no-undef-init": "error",
		"no-underscore-dangle": "off",
		"no-unsafe-finally": "error",
		"no-var": "error",
		"prefer-const": "error",
		"radix": "error",
		"use-isnan": "error",
		"valid-typeof": "off",

		// Native formatting ESLint rules
		"arrow-parens": "off", // overriden via Prettier
		"comma-dangle": "off", // overriden via Prettier
		"template-curly-spacing": ["error", "never"],
		"eol-last": "error",
		"id-match": "error",
		"indent": "off", // overriden via Prettier
		"linebreak-style": "error",
		"max-len": "off", // overriden via Prettier
		"new-parens": "error",
		"no-return-await": "off",
		"no-trailing-spaces": "error",
		"no-unused-labels": "error",
		"object-shorthand": "error",
		"one-var": ["error", "never"],
		"prefer-object-spread": "error",
		"prefer-template": "error",
		"quotes": "off", // overriden via Prettier
		"semi": "off", // overriden via Prettier
		"spaced-comment": [
			"error",
			"always",
			{ markers: ["/"] }
		],

		// Prettier formatting as ESLint errors, might override ESLint formatting rule
		"prettier/prettier": "error",
		"arrow-body-style": "off", // Turned off to prevent a bug with ESLint --fix
		"prefer-arrow-callback": "off", // Turned off to prevent a bug with ESLint --fix

		// Misc. plugins
		"import/order": "error",
		"prefer-arrow/prefer-arrow-functions": "error",

		// TypeScript semantic rules
		"@typescript-eslint/ban-types": ["error", {
			types: {
				"Object": { message: "Avoid using the `Object` type. Did you mean `object`?" },
				"Function": { message: "Avoid using the `Function` type. Prefer a specific function type, like `() => void`." },
				"Boolean": { message: "Avoid using the `Boolean` type. Did you mean `boolean`?" },
				"Number": { message: "Avoid using the `Number` type. Did you mean `number`?" },
				"String": { message: "Avoid using the `String` type. Did you mean `string`?" },
				"Symbol": { message: "Avoid using the `Symbol` type. Did you mean `symbol`?" }
			}
		}],
		"@typescript-eslint/explicit-member-accessibility": ["off", { accessibility: "explicit" }],
		"@typescript-eslint/no-misused-new": "error",
		"@typescript-eslint/no-namespace": "error",
		"@typescript-eslint/no-shadow": ["error", { hoist: "all" }],
		"@typescript-eslint/no-var-requires": "error",
		"@typescript-eslint/prefer-for-of": "error",
		"@typescript-eslint/prefer-function-type": "error",
		"@typescript-eslint/prefer-namespace-keyword": "error",
		"@typescript-eslint/triple-slash-reference": ["error", {
			path: "always",
			types: "prefer-import",
			lib: "always"
		}],

		// TypeScript formatting rules
		"@typescript-eslint/adjacent-overload-signatures": "error",
		"@typescript-eslint/array-type": ["error", { default: "array" }],
		"@typescript-eslint/consistent-type-assertions": "error",
		"@typescript-eslint/dot-notation": "error",
		"@typescript-eslint/indent": "off", // overriden via Prettier
		"@typescript-eslint/member-delimiter-style": ["error", {
			multiline: {
				delimiter: "semi",
				requireLast: true
			},
			singleline: {
				delimiter: "semi",
				requireLast: false
			}
		}],
		"@typescript-eslint/member-ordering": "off",
		"@typescript-eslint/naming-convention": "off",
		"@typescript-eslint/no-empty-function": "off",
		"@typescript-eslint/no-empty-interface": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-parameter-properties": "off",
		"@typescript-eslint/no-unused-expressions": "error",
		"@typescript-eslint/no-use-before-define": "off",
		"@typescript-eslint/quotes": "off", // overriden via Prettier
		"@typescript-eslint/semi": "off", // overriden via Prettier
		"@typescript-eslint/unified-signatures": "error",
	}
};
