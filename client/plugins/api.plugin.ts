import Vue from "vue";
import axios from "axios";

class Api extends Vue {
	async post(route: string, data?: any, params?: Object, onSuccess?: Function, onError?: Function) {
		try {
			await axios
				.post(process.env.apiBaseUrl + route, data, { withCredentials: true, params })
				.then((response) => {
					onSuccess?.(response);
				})
				.catch((err) => {
					Vue.prototype.alert.emit({ title: "Error", message: err.response.data.message });
					onError?.(err);
				});
		} catch {}
	}

	async get(route: string, params?: Object, onSuccess?: Function, onError?: Function) {
		try {
			await axios
				.get(process.env.apiBaseUrl + route, { withCredentials: true, params })
				.then((response) => {
					onSuccess?.(response);
				})
				.catch((err) => {
					Vue.prototype.alert.emit({ title: "Error", message: err.response.data.message });
					onError?.(err);
				});
		} catch {}
	}

	async delete(route: string, params?: Object, onSuccess?: Function, onError?: Function) {
		try {
			await axios
				.delete(process.env.apiBaseUrl + route, { withCredentials: true, params })
				.then((response) => {
					onSuccess?.(response);
				})
				.catch((err) => {
					Vue.prototype.alert.emit({ title: "Error", message: err.response.data.message });
					onError?.(err);
				});
		} catch {}
	}

	async put(route: string, data?: any, params?: Object, onSuccess?: Function, onError?: Function) {
		try {
			await axios
				.put(process.env.apiBaseUrl + route, data, { withCredentials: true, params })
				.then((response) => {
					onSuccess?.(response);
				})
				.catch((err) => {
					Vue.prototype.alert.emit({ title: "Error", message: err.response.data.message });
					onError?.(err);
				});
		} catch {}
	}
}

declare module "vue/types/vue" {
	interface Vue {
		api: Api;
	}
}

Vue.prototype.api = new Api();
