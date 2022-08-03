<template>
	<div
		class="min-w-max w-full h-full flex flex-col items-center border-4 border-design_white bg-design_black overflow-hidden rounded-md"
	>
		<!-- Title -->
		<div
			id="title"
			class="text-design_white h-8 justify-center top-1/2 flex w-full border-b-2 border-design_white text-center bg-design_blue"
		>
			<div class="inline-block align-center">MATCHMAKING</div>
		</div>
		<!-- Content -->
		<div id="content" class="text-design_white w-full h-full">
			<!-- Display stats of the player-->
			<br />
			<div class="flex flex-col w-full items-center justify-around">
				<!-- User profile picture -->
				<div id="profile-picture" class="flex h-1/3 w-1/3 items-center justify-center">
					<img v-if="user.image_url" :src="user.image_url" class="rounded-full w-24 h-24" />
					<img v-else src="~/assets/profile.png" class="rounded-full w-24 h-24" />
				</div>
			</div>
			<h3>{{ user.id }}</h3>
			<br />
			<p>Total played games : {{ user.nb_game }}</p>
			<p>Total victory : {{ user.nb_win }}</p>
		</div>
		<!-- Launch game buttons button -->
		<div id="inputs" class="text-design_white flex flex-row h-12 w-full bg-design_blue border-t-4 border-white">
			<SelectMenu
				id-prop="matchmaking-select"
				:options="gameModes"
				class="w-full text-center hover:text-gray-300"
			/>
		</div>
		<div id="inputs" class="text-design_white flex flex-row h-12 w-full bg-design_blue border-t-4 border-white">
			<button class="w-full text-center hover:text-gray-300" @click="handleClick">
				{{ buttonContent[0] }} {{ buttonContent[1] }}
			</button>
		</div>
		<div id="inputs" class="text-design_white flex flex-row h-12 w-full bg-design_blue border-t-4 border-white">
			<button class="w-full text-center hover:text-gray-300" @click="matchBot">BOT</button>
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
