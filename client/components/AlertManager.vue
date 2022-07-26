<template>
	<div>
		<Alert
			v-for="(alert, index) in alerts.slice(-3)"
			:key="index"
			:id-prop="index"
			:title="alert.title"
			:message="alert.message"
		/>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
type Alert = { title: string; message: string };
export default Vue.extend({
	data: () => ({
		alerts: [] as Alert[],
		nextClear: 0,
	}),
	mounted() {
		this.$nuxt.$on("addAlert", (alert: Alert) => {
			if (!this) return;
			console.error("[ALERT]", alert.title, ":", alert.message);

			// Reset clear timer.
			window.clearTimeout(this.nextClear);

			alert.title = Date.now().toString();
			// Add the new alert.
			this.alerts = [...this.alerts, alert];

			// Set the alert list to be cleared in 3.5 seconds.
			this.nextClear = window.setTimeout(() => {
				this.alerts = [];
			}, 100000);
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
			}, 100000);
		});
	},
});
</script>
