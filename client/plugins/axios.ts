import { Context } from "@nuxt/types";

export default function ({ $axios, redirect, $config }: Context) {
	$axios.onError((error) => {
		console.log("axios err:", { ...error });
		if (error.response && error.response.status === 401) {
			if (error.response.data.authMethod && error.response.data.authMethod === "totp") redirect("/totp");
			else if (error.response.data.authMethod && error.response.data.authMethod === "42")
				window.location.href = `${$config.ft_api.url}/auth/42`;
		}
	});
}
