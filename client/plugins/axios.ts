import { Context } from "@nuxt/types";

export default function ({ $axios, redirect, $config }: Context) {
	// Handle all 401 errors to redirect to required authentication handler
	$axios.onError((error) => {
		// Ensure error code is 401
		if (error.response && error.response.status === 401) {
			// Ensure missing auth is TOTP
			if (error.response.data.authMethod && error.response.data.authMethod === "totp")
				// Handle missing TOTP auth in client
				redirect("/totp_authenticate");
			// Ensure missing auth is 42 OAuth
			else if (error.response.data.authMethod && error.response.data.authMethod === "42")
				// Handle missing 42 OAuth by redirecting to the API handler
				window.location.href = `${$config.ft_api.url}/auth/42`;
		}
	});
}
