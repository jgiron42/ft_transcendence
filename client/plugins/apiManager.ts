import Vue from "vue";
import axios from "axios";

interface apiInterface {
	get(route: string, data: Object, onSuccess: Function, onError: Function): Promise<void>;
	post(route: string, data: Object, onSuccess: Function, onError: Function): Promise<void>;
}

declare module "vue/types/vue" {
	interface Vue {
		api: apiInterface;
	}
}

Vue.prototype.api = <apiInterface>{
	async post(route: string, data: Object, onSuccess: (a: any) => {}, onError: (a: any) => {}) {
		await axios
			.post(process.env.apiBaseUrl + route, data, { withCredentials: true })
			.then((response) => {
				onSuccess(response);
			})
			.catch((error) => {
				// error.response.data.message
				onError(error);
			});
	},
	async get(route: string, onSuccess: (a: any) => {}, onError: (a: any) => {}) {
		await axios
			.get(process.env.apiBaseUrl + route, { withCredentials: true })
			.then((response) => {
				onSuccess(response);
			})
			.catch((error) => {
				onError(error);
			});
	},
};
