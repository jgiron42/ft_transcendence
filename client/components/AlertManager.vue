<template>
	<div>
		<Alert v-for="(alert, index) in alerts" :key="index" :title="alert.title" :message="alert.message" />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
type Alert = { title: string; message: string };
export default Vue.extend({
	data: () => ({
		alerts: [] as Array<Alert>,
		nextClear: 0,
	}),
	mounted() {
		this.$nuxt.$on("addAlert", (alert: Alert) => {
			// console.error("[ALERT]", alert.title, ":", alert.message);

			// Reset clear timer.
			window.clearTimeout(this.nextClear);

			// Add the new alert.
			this.alerts = [...this.alerts, alert];

			// Set the alert list to be cleared in 3.5 seconds.
			this.nextClear = window.setTimeout(() => {
				this.alerts = [];
			}, 3500);
		});
	},
});
</script>
