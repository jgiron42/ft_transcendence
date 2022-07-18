import { Middleware } from "@nuxt/types";
import { store } from "@/store";

const auth: Middleware = (context) => {
	const path =
		context.route.path.length && context.route.path[0] === "/" ? context.route.path.slice(1) : context.route.path;
	if (store.user.me.id === null) {
		context.redirect("/login?redirect=" + path);
	}
};

export default auth;
