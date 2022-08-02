import { Middleware } from "@nuxt/types";

const getUser: Middleware = async () => {
	if (!process.server) await window.$nuxt.$user.getUser();
};

export default getUser;
