import Vue from "vue";
import axios from "axios";

interface apiInterface {
	get(route: string, params?: Object | null, onSuccess?: Function | null, onError?: Function | null): Promise<void>;
	post(
		route: string,
		data?: Object | null,
		params?: Object | null,
		onSuccess?: Function | null,
		onError?: Function | null,
	): Promise<void>;
}

declare module "vue/types/vue" {
	interface Vue {
		api: apiInterface;
	}
}

Vue.prototype.api = <apiInterface>{
	async post(route: string, data = null, params = null, onSuccess = null, onError = null) {
		await axios
			.post(process.env.apiBaseUrl + route, data, { withCredentials: true, params })
			.then((response) => {
				if (onSuccess !== null) onSuccess(response);
			})
			.catch((err) => {
				// error.response.data.message
				if (onError !== null) onError(err);
			});
	},
	async get(route: string, params = null, onSuccess = null, onError = null) {
		await axios
			.get(process.env.apiBaseUrl + route, { withCredentials: true, params })
			.then((response) => {
				if (onSuccess !== null) onSuccess(response);
			})
			.catch((err) => {
				if (onError !== null) onError(err);
			});
	},
};
