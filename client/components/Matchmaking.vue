<template>
	<div @click="handleClick"><BoxButton type="button" :content="buttonContent" /></div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
	// Data should be updated by websocket events
	data: () => ({
		waiting: false,
		buttonContent: ["FIND A MATCH"],
		searchElaspedTime: 0,
		usersAvailable: 0,
		connection: undefined,
	}),
	mounted() {
		// Init websocket connection (TODO)
		this.initConnection();

		// Launch first update to init values
		this.updateMatchmakingStatus();

		// Run an update every second
		// ESLint may find the wrong NodeJS def instead of the DOM lib def
		// https://stackoverflow.com/questions/45802988/typescript-use-correct-version-of-settimeout-node-vs-window
		window.setInterval(this.updateMatchmakingStatus, 1000);
	},
	methods: {
		initConnection() {
			// TODO: Websockets
			this.connection = undefined;
		},
		updateMatchmakingStatus() {
			if (this.waiting) {
				// Increase time counter
				this.searchElaspedTime += 1;

				// Update displayed content
				this.buttonContent = ["SEARCHING...", `(${this.searchElaspedTime})`];

				// Mock found match.
				if (this.searchElaspedTime > 15) this.$nuxt.$emit("matchFound", 2727);
			} else {
				// Mock user counter
				this.usersAvailable = 0;
				this.buttonContent = ["FIND A MATCH", `(${this.usersAvailable} users)`];
			}
		},
		handleClick() {
			console.log("handling click..");

			// Switch status
			this.waiting = !this.waiting;

			// Reset values
			this.searchElaspedTime = 0;
			this.usersAvailable = 0;

			// Run the correct update.
			this.updateMatchmakingStatus();
		},
	},
});
</script>
