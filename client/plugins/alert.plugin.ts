import Vue from "vue";
import _ from "lodash";

type Alert = Partial<{ title: string; message: string; isError: boolean }>;

class AlertPlugin extends Vue {
	emit(alert: Alert) {
		this.$nuxt.$emit("addAlert", _.cloneDeep(alert));
	}
}

declare module "vue/types/vue" {
	interface Vue {
		alert: AlertPlugin;
	}
}

Vue.prototype.alert = new AlertPlugin();
