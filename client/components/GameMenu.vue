<template>
	<div v-if="gamemode === true" class="flex flex-row menu_game">
		<div class="selection_menu_game flex flex-col">
			<select id="type-select" v-model="local" class="menu_game_items text-black p-2">
				<option :value="1">local</option>
				<option :value="0">online</option>
			</select>
			<select id="type-select" v-model="flappypong" class="menu_game_items text-black p-2">
				<option :value="0">default game</option>
				<option :value="2">flappypong</option>
			</select>
			<button class="menu_game_items button_class" @click.prevent="launchGame()">Launch a game</button>
		</div>
		<div class="flex center_game">
			<Game :menuid="4" />
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
			this.gamemode = false;
		},
	},
});
</script>

<style>
.background-logo {
	background: bg-design_gray;
	height: 80%;
	width: 100%;
	margin-top: auto;
	margin-bottom: auto;
}

.selection_menu_game {
	display: grid;
	align-content: center;
	justify-content: center;
}

.menu_game {
	overflow: auto;
	width: 100%;
	height: 100%;
	white-space: nowrap;
	vertical-align: center;
}

.menu_game_items {
	width: 100%;
	height: 100%;
	display: grid;
	margin-left: 15%;
	align-content: center;
	justify-content: center;
}

.center_game {
	width: 100%;
	height: 100%;
	margin-right: auto;
	margin-left: auto;
	display: grid;
	align-content: center;
	justify-content: center;
}

.button_class {
	overflow: hidden;
	color: black;
	font: 1em "Open Sans", sans-serif;
	font-size: small;
	width: 100%;
	padding: 10px;
	border-radius: 10px;
	text-align: center;
	background-color: #cecece;
	display: inline;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
