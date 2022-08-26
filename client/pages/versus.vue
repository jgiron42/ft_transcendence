<template>
	<div class="h-full w-full flex justify-center items-center text-center overflow-hidden">
		<div class="h-full min-w-max w-full max-w-full">
			<GameVersus v-if="status === 'creating' && p1.id" :p1="p1.id" :p2="p2.id" />
			<BoxButton v-else class="h-5/6 w-11/12 uppercase" :enable-hover="false" :content="[status]" />
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { User } from "@/models/User";
import { ClientMatch } from "~/types/game-status";

export default Vue.extend({
	layout: "game",
	middleware: ["getUser"],
	data: () => ({
		status: "creating" as "creating" | "ongoing" | "finished" | "aborted",
		p1: {} as User,
		p2: {} as User,
		timeout: 0,
	}),
	mounted() {
		// Stop handling matchmaking events.
		this.$gameSocket.clearMatchingEvents("matchmaking");

		// Hangle game updates.
		this.$gameSocket.on("game:updateStatus", async (game: ClientMatch) => {
			// Redirect to game page when game has started.
			if (game.status === "ongoing") {
				// Format the game mode approriately.
				this.$game.mode = "online:" + game.mode;

				// Get the player side (P1 = left, P2 = right)
				this.$game.isP1 = (await this.$user.getUser()).id === game.p1.id;

				// Actually redirect to the game page.
				this.$nuxt.$router.push("/game");
			}

			// Update displayed status
			this.status = game.status;

			// Update player 1 data.
			this.p1 = game.p1;

			// Update player 2 data.
			this.p2 = game.p2;
		});

		// Redirect to matchmakig when no events were received in 5s
		this.timeout = window.setTimeout(() => this.$nuxt.$router.push("/matchmaking"), 5000);
	},
	beforeDestroy() {
		// Clear current game updates listeners.
		this.$gameSocket.clearMatchingEvents("game");

		window.clearTimeout(this.timeout);
	},
});
</script>
