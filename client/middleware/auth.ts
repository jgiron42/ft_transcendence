import { Middleware } from "@nuxt/types";
import { chatStore } from "@/store/";
// import { chatStore } from "@/store/"

const auth: Middleware = (context) => {
	const path =
		context.route.path.length && context.route.path[0] === "/" ? context.route.path.slice(1) : context.route.path;
	if (chatStore.me.id === null) {
		context.redirect("/login?redirect=" + path);
	}
};

export default auth;
