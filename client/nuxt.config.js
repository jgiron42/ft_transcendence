export default {
	server: {
		port: 4000,
		host: "0.0.0.0",
	},
	// Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
	ssr: false,

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
		{ src: "@/plugins/vue-js-modal", mode: "client" },
		{ src: "@/plugins/api.plugin", mode: "client" },
		{ src: "@/plugins/socketManager", mode: "client" },
	],

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
	modules: ["cookie-universal-nuxt", "nuxt-socket-io"],

	io: {
		sockets: [
			{
				name: "chat",
				url: process.env.API_BASE_URL || "http://localhost:3000",
				default: true,
			},
		],
	},

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {},

	env: {
		apiBaseUrl: process.env.API_BASE_URL || "http://localhost:3000",
	},
	components: {
		dirs: [
			"~/components",
			"~/components/chat",
			"~/components/chat/channels",
			"~/components/chat/users",
			"~/components/chat/channels/popup",
		],
	},
};
