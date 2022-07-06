import { Middleware } from "@nuxt/types";
import Vue from "vue";

const getUser: Middleware = async () => {
	await Vue.prototype.chat.whoAmI();
};

export default getUser;
