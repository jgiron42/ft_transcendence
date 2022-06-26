<template>
	<Matchmaking v-if="!inGame" />
	<Game v-else :game-i-d="gameID" />
</template>

<script lang="ts">
import Vue from "vue";
import { NuxtSocket } from "nuxt-socket-io";
import Matchmaking from "./Matchmaking.vue";
import Game from "./Game.vue";

export default Vue.extend({
	components: { Matchmaking, Game },
	data: () => ({
		gameID: 42,
		inGame: false,
		matchmakingSocket: {} as NuxtSocket,
	}),
	mounted() {
		// Instantiate websocket
		this.matchmakingSocket = this.$nuxtSocket({
			name: "matchmaking",
			channel: "/matchmaking",
			reconnection: true,
			reconnectionAttempts: Infinity,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 5000,
			timeout: 10000,
			autoConnect: true,
			transports: ["websocket"],
			teardown: false,
			forceNew: false,
		});

		this.matchmakingSocket.on("connect_error", (err) => {
			console.log("[MATCHMAKING]: ERROR:", err);
			this.$nuxt.$emit("addAlert", { title: "MATCHMAKING ERROR", message: JSON.stringify(err) });
		});
		// Log all event
		this.matchmakingSocket.onAny((event, ...args) => {
			console.log("[MATCHMAKING]:", event, args);
		});

		// Handle match found event
		this.$nuxt.$on("matchFound", (gameID: number) => {
			// Pass the found gameID to the Game component.
			this.gameID = gameID;

			// Switch the displayed component.
			this.inGame = true;
		});
	},
});
</script>
