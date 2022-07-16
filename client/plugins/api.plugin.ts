import Vue from "vue";
import axios from "axios";
import { Context } from "@nuxt/types";

class Api extends Vue {
	private context: Context;

	constructor(context: Context) {
		super();
		this.context = context;
	}

	async post(route: string, data?: any, params?: Object, onSuccess?: Function, onError?: Function) {
		await this.context.$axios
			.post(this.context.$config.ft_api.url + route, data, { withCredentials: true, params })
			.then((response) => {
				onSuccess?.(response);
			})
			.catch((err) => {
				// error.response.data.message
				onError?.(err);
			});
	}

	async get(route: string, params?: Object, onSuccess?: Function, onError?: Function) {
		await this.context.$axios
			.get(this.context.$config.ft_api.url + route, { withCredentials: true, params })
			.then((response) => {
				onSuccess?.(response);
			})
			.catch((err) => {
				onError?.(err);
			});
	}

	async delete(route: string, params?: Object, onSuccess?: Function, onError?: Function) {
		await axios
			.delete(this.context.$config.ft_api.url + route, { withCredentials: true, params })
			.then((response) => {
				onSuccess?.(response);
			})
			.catch((err) => {
				onError?.(err);
			});
	}
}

declare module "vue/types/vue" {
	interface Vue {
		api: Api;
	}
}

// https://stackoverflow.com/questions/67989113/nuxtjs-publicruntimeconfig-in-typescript-plugin
// https://nuxtjs.org/docs/internals-glossary/context/
export default function (context: Context) {
	Vue.prototype.api = new Api(context);
}
