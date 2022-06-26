<template>
	<Matchmaking v-if="!inGame" />
	<Game v-else :game-i-d="gameID" />
</template>

<script lang="ts">
import Matchmaking from "./Matchmaking.vue";
import Game from "./Game.vue";

export default {
	components: { Matchmaking, Game },
	data: () => ({
		gameID: 42,
		inGame: false,
	}),
	mounted() {
		this.$nuxt.$on("matchFound", (gameID: number) => {
			// Pass the found gameID to the Game component.
			this.gameID = gameID;

			// Switch the displayed component.
			this.inGame = true;
		});
	},
};
</script>
