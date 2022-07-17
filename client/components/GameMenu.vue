<template>
	<div v-if="gamemode === true" class="flex flex-row">
		<div class="center_div">
			<div>
				<select id="type-select" v-model="local" class="text-black p-2">
					<option :value="1">local</option>
					<option :value="0">online</option>
				</select>
			</div>
			<div>
				<select id="type-select" v-model="flappypong" class="text-black p-2">
					<option :value="0">default game</option>
					<option :value="2">flappypong</option>
				</select>
			</div>
			<div>
				<button @click.prevent="launchGame()">CLIQUE ICI LOL</button>
			</div>
		</div>
	</div>
	<div v-else class="flex center_game">
		<Game :menuid="game" />
	</div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
	name: "game menu",
	data() {
		return {
			local: Number,
			flappypong: Number,
			gamemode: true,
			game: Number,
		};
	},
	mounted() {
		this.local = 1;
		this.flappypong = 0;
	},
	methods: {
		launchGame() {
			this.game = this.flappypong + this.local;
			console.log("THIS IS IN THE FUCKING CHOICE MOTHER FUCKER " + this.game);
			this.gamemode = false;
		},
	},
});
</script>

<style>
.center_game {
	width: 100%;
	height: 100%;
	margin-right: auto;
	margin-left: auto;
	font: 1em "Open Sans", sans-serif;
	display: grid;
	align-content: center;
	justify-content: center;
}
</style>
