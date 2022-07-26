<template>
	<div>
		<div v-if="authenticated">
			<ObjectDebug :object="user" />
			<div class="flex flex-row justify-center">
				<ObjectDebug title="connected:" :array="connectedPool" />
				<ObjectDebug :title="`${selectedPool}:`" :array="matchmakingPools[selectedPool]" />
			</div>
		</div>
		<div class="flex flex-row justify-center">
			<SelectMenu id-prop="matchmaking-select" :options="gameModes" />
			<div @click="handleClick"><BoxButton type="button" :content="buttonContent" /></div>
			<div @click="matchBot"><BoxButton type="button" :content="['BOT']" /></div>
		</div>
	</div>
</template>
<script lang="ts">
import Vue from "vue";
import { User } from "~/models/User";
import { UserMatchmakingStatus } from "@/types/matchmaking-status";
import SocketHubInterface from "~/types/socker-hub";

export default Vue.extend({
	data: () => ({
		waiting: false,
		buttonContent: ["FIND A MATCH"],
		searchElaspedTime: 0,
		usersAvailable: 0,
		matchmakingSocket: {} as SocketHubInterface,
		selectedPool: "",
		authenticated: false,
		user: new User(),
		connectedPool: [""],
		matchmakingPools: {} as Record<string, string[]>,
		gameModes: [""],
	}),
	mounted() {
		// Init websocket connection
		this.initConnection();

		// Launch first update to init values
		this.updateMatchmakingStatus();
		// Run an update every second
		// ESLint may find the wrong NodeJS def instead of the DOM lib def
		// https://stackoverflow.com/questions/45802988/typescript-use-correct-version-of-settimeout-node-vs-window
		window.setInterval(this.updateMatchmakingStatus, 1000);

		// Add listener for input change
		this.$nuxt.$on("matchmaking-select-change", (data: string) => (this.selectedPool = data));
	},
	methods: {
		initConnection() {
			// Instantiate websocket
			this.matchmakingSocket = this.$nuxt.$gameSocket;

			// Subscribe to user updates.
			this.matchmakingSocket.on("matchmaking:updateStatus", this.updateStatus);
		},
		updateStatus(status: UserMatchmakingStatus) {
			// Get updated user
			this.user = status.user;

			// Display content available to authenticated users
			this.authenticated = true;

			// Update content depending on user matchmaking status
			switch (status.status) {
				case "connected":
					// User is not currently searching for a game
					this.waiting = false;
					break;
				case "matchmaking":
					// User is searching for a game
					this.waiting = true;

					// Update local search duration
					this.searchElaspedTime = Math.floor((Date.now() - status.searchDate) / 1000);
					break;
				case "game":
					// Clean matchmaking listeners
					this.$gameSocket.clearMatchingEvents("matchmaking");

					// Redirect to game page
					window.$nuxt.$router.push("/game");
					return;
			}
			// Update local selection
			this.selectedPool = this.selectedPool || status.availableGameModes[0];

			// Update matchmaking matchmakingPools
			this.matchmakingPools = status.matchMakingPools;

			// Update connected user list
			this.connectedPool = status.connectedPool;

			// Get number of connected users
			this.usersAvailable = status.connectedPool.length;

			// Get list of available game modes
			this.gameModes = status.availableGameModes;

			// Force content re-render (filthy)
			this.$nextTick(() => {
				this.authenticated = false;
				this.$nextTick(() => {
					this.authenticated = true;
				});
			});
		},
		updateMatchmakingStatus() {
			if (this.waiting) {
				// Increase time counter
				this.searchElaspedTime += 1;

				// Update displayed content
				this.buttonContent = ["SEARCHING...", `(${this.searchElaspedTime})`];
			} else {
				this.buttonContent = ["FIND A MATCH", `(${this.usersAvailable} users)`];
			}
		},
		handleClick() {
			// Reset values
			this.searchElaspedTime = 0;

			// https://stackoverflow.com/questions/1085801/get-selected-value-in-dropdown-list-using-javascript
			// Scrap selected value
			const selector = document.getElementById("matchmaking-select") as HTMLSelectElement;
			const selectedGameMode = selector.options[selector.selectedIndex].text;

			// Cancel or start game search.
			this.matchmakingSocket.emit(this.waiting ? "matchmaking:cancelSearchGame" : "matchmaking:searchGame", {
				mode: selectedGameMode,
			});

			// Run the correct update.
			this.updateMatchmakingStatus();
		},
		matchBot() {
			// Ask server to match self with a bot
			this.matchmakingSocket.emit("matchmaking:matchBot", { mode: this.selectedPool });
		},
	},
});
</script>
