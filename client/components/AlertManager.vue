<template>
	<div>
		<Alert
			v-for="(alert, index) in alerts.slice(-3)"
			:key="index"
			:id-prop="index"
			:title="alert.title"
			:is-error="alert.isError"
			:message="alert.message"
		/>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import _ from "lodash";

type Alert = Partial<{ title: string; message: string; isError: boolean }>;
export default Vue.extend({
	data: () => ({
		alerts: [] as Alert[],
		nextClear: 0,
	}),
	mounted() {
		this.$nuxt.$on("addAlert", (alert: Alert) => {
			if (!this) return;

			if (alert.isError === false) console.info("[ALERT]", alert.title, ":", alert.message);
			else console.warn("[ALERT]", alert.title, ":", alert.message);

			// Reset clear timer.
			window.clearTimeout(this.nextClear);

			// Add the new alert.
			this.alerts = [
				...this.alerts,
				{
					..._.cloneDeep(alert),
					title: alert.title ? alert.title : "ALERT",
					isError: alert.isError === undefined || alert.isError,
				},
			];

			// Set the alert list to be cleared in 3.5 seconds.
			this.nextClear = window.setTimeout(() => {
				this.alerts = [];
			}, 5000);
		});

		this.$nuxt.$on("delAlert", (id: number) => {
			if (!this) return;

			// Reset clear timer.
			window.clearTimeout(this.nextClear);

			const alerts = this.alerts as Alert[];
			alerts.splice(alerts.length - 3 + id, 1);
			this.alerts = alerts;

			// Set the alert list to be cleared in 3.5 seconds.
			this.nextClear = window.setTimeout(() => {
				this.alerts = [];
			}, 5000);
		});

		this.$nuxt.$on("clearAlerts", () => (this.alerts = []));
	},
});
</script>
