<template>
	<div class="h-full w-full flex justify-center items-center text-center overflow-hidden">
		<div class="h-full min-w-max w-full max-w-full">
			<GameVersus v-if="status === 'creating' && self.id" :self="self.id" :opponent="opponent.id" />
			<BoxButton v-else class="h-5/6 w-11/12 uppercase" :enable-hover="false" :content="[status]" />
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { User } from "@/models/User";
import { ClientMatch } from "~/types/game-status";

export default Vue.extend({
	data: () => ({
		status: "creating" as "creating" | "ongoing" | "finished" | "aborted",
		self: {} as User,
		opponent: {} as User,
	}),
	mounted() {
		this.$gameSocket.clearMatchingEvents("matchmaking");
		this.$gameSocket.on("game:updateStatus", (game: ClientMatch) => {
			console.log("game:", game);
			this.status = game.status;
			this.self = game.self;
			this.opponent = game.opponent;
		});
	},
});
</script>
