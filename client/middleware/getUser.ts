import { Middleware } from "@nuxt/types";

const getUser: Middleware = async () => {
	try {
		if (!process.server) await window.$nuxt.$user.getUser();
	} catch (err: any) {
		window.$nuxt.alert.emit({ title: "MIDDLEWARE", message: `Couldn't fetch user: ${err.toString()}` });
	}
};

export default getUser;
