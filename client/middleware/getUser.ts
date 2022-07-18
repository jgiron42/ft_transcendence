import { Middleware } from "@nuxt/types";
import { store } from "@/store";
import { initialiseStores } from "@/utils/store-accessor";

const getUser: Middleware = async (context) => {
	initialiseStores(context.store);
	await store.user.getUser();
};

export default getUser;
