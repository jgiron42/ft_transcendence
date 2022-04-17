module.exports = {
	extends: ["stylelint-config-standard", "stylelint-config-recommended-vue", "stylelint-config-prettier"],
	// add your custom config here
	// https://stylelint.io/user-guide/configuration
	rules: {
		"at-rule-no-unknown": [
			true,
			{
				ignoreAtRules: [
					"tailwind",
					"apply",
					"variants",
					"responsive",
					"screen",
					"layer",
					"include",
					"mixin",
					"at-root",
					"use",
				],
			},
		],
		"declaration-block-trailing-semicolon": null,
		"no-descending-specificity": null,
		"block-no-empty": null,
		"selector-class-pattern": false, // Turned off CSS class nomenclature
	},
};
