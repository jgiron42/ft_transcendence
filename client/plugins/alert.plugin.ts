import Vue from "vue";

type Alert = { title: string; message: string };

class AlertPlugin extends Vue {
	async emit(alert: Alert) {
		await this.$nuxt.$emit("addAlert", alert);
	}
}

declare module "vue/types/vue" {
	interface Vue {
		alert: AlertPlugin;
	}
}

Vue.prototype.alert = new AlertPlugin();
