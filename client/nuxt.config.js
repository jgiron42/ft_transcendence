export default {
	server: {
		port: 4000,
		host: "0.0.0.0",
	},
	// Disable Server Side Rendering
	ssr: false,
	// Global page headers: https://go.nuxtjs.dev/config-head
	head: { title: "ft_transcendance" },
	// Global CSS: https://go.nuxtjs.dev/config-css
	css: [],
	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [{ src: "~plugins/vue-modal.js", mode: "client" }],
	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,
	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		// https://go.nuxtjs.dev/eslint
		"@nuxtjs/eslint-module",
		// https://go.nuxtjs.dev/stylelint
		"@nuxtjs/stylelint-module",
		// https://go.nuxtjs.dev/tailwindcss
		"@nuxtjs/tailwindcss",
		// https://github.com/nuxt-community/moment-module#readme
		"@nuxtjs/moment",
	],
	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
		// https://go.nuxtjs.dev/axios
		"@nuxtjs/axios",
	],
	tailwindcss: {
		// Toggle the Tailwind design system viewer for faster compilation times
		viewer: true,
		// Just In Time flag for faster compilation times
		jit: false,
	},
	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {},
	axios: {
		proxy: true,
		credentials: true,
		headers: { "Access-Control-Allow-Origin": "*" },
		proxyHeaders: { "Access-Control-Allow-Origin": "*" },
	},
};
