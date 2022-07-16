export default {
	server: {
		port: 4000,
		host: "0.0.0.0",
	},
	// Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
	ssr: true,

	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		title: "transcendance-client",
		htmlAttrs: {
			lang: "en",
		},
		meta: [
			{ charset: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ hid: "description", name: "description", content: "" },
			{ name: "format-detection", content: "telephone=no" },
		],
		link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
	},

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
		{ src: "@/plugins/api.plugin", mode: "all" },
		{ src: "@/plugins/axios.ts", mode: "all" },
	],

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		// https://go.nuxtjs.dev/typescript
		"@nuxt/typescript-build",
		// https://go.nuxtjs.dev/stylelint
		"@nuxtjs/stylelint-module",
		// https://go.nuxtjs.dev/tailwindcss
		"@nuxtjs/tailwindcss",
		"@nuxtjs/device",
	],

	css: ["~/layouts/global.css"],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: ["@nuxtjs/axios"],

	// axios: {
	// 	baseURL: process.env.baseURL || "http://localhost:4000", // Used as fallback if no runtime config is provided
	// },
	publicRuntimeConfig: {
		// axios: {
		// 	browserBaseURL: process.env.BROWSER_BASE_URL + "/api" || "http://localhost:4000",
		// },
		ft_api: {
			url:
				process.env.API_URL ||
				(process.browser ? `http://${window.location.hostname}:3000` : "http://localhost:3000"),
		},
	},
	// privateRuntimeConfig: {
	// 	axios: {
	// 		baseURL: process.env.BASE_URL,
	// 	},
	// },
	io: {},

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {
		transpile: ["lodash-es"],
	},
};
