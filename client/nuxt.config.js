export default {
	server: {
		port: 4000,
		host: "0.0.0.0",
	},
	// Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
	ssr: true,

	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		title: "ft_transcendence",
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
		{ src: "@/plugins/alert.plugin", mode: "client" },
		{ src: "@/plugins/user.plugin", mode: "client" },
		{ src: "@/plugins/picture.plugin", mode: "all" },
		{ src: "@/plugins/socket-manager", mode: "client" },
		{ src: "@/plugins/axios", mode: "all" },
		{ src: "@/plugins/game.plugin", mode: "all" },
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

	css: ["@/layouts/global.css"],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: ["cookie-universal-nuxt", "nuxt-socket-io", "@nuxtjs/axios"],

	io: {
		sockets: [
			{
				name: "game",
				url: process.env.WSS_BASE_URL || "ws://localhost:3000",
				default: true,
			},
			{
				name: "chat",
				url: process.env.WSS_BASE_URL || "http://localhost:3000",
			},
		],
	},

	axios: {
		baseURL: process.env.API_BASE_URL,
		withCredentials: true,
	},

	publicRuntimeConfig: {
		axios: {
			browserBaseURL: process.env.BROWSER_BASE_URL,
		},
		ft_api: {
			url:
				process.env.API_BASE_URL ||
				(process.browser ? `http://${window.location.hostname}:3000` : "http://localhost:3000"),
		},
	},

	privateRuntimeConfig: {
		axios: {
			baseURL: process.env.BASE_URL,
		},
		ft_api: {
			url:
				process.env.API_BASE_URL ||
				(process.browser ? `http://${window.location.hostname}:3000` : "http://localhost:3000"),
		},
	},

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {
		postcss: {
			plugins: {
				"postcss-import": true,
			},
		},
	},

	env: {
		apiBaseUrl: process.env.API_BASE_URL || "http://localhost:3000",
	},

	components: {
		dirs: [
			"~/components",
			"~/components/chat",
			"~/components/chat/channels",
			"~/components/chat/users",
			"~/components/chat/popup",
			"~/components/svg",
			"~/components/game",
			"~/components/settings",
		],
	},

	// Disable broken SSR on chat
	serverMiddleware: [
		{
			path: "/chat",
			handler: (_, res, next) => {
				res.spa = true;
				next();
			},
		},
	],
};
