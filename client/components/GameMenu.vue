<template>
	<div v-if="gamemode === 0" class="flex flex-row menu_game">
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
	<div v-else-if="gamemode === 1" class="versus_display diagonal">
		<div class="flex top_left flex-row flex-wrap">
			<img src="https://cdn.intra.42.fr/users/frtalleu.jpg" class="player_image" />
			<div class="player_stat flex flex-col">
				<div class="win" data-win-count="300"></div>
				<div class="lose" data-lose-count="0"></div>
			</div>
			<div class="player_name flex">FRTALLEU</div>
		</div>
		<div class="flex bottom_right flex-row flex-wrap">
			<div class="player_name flex">SMACCARY</div>
			<div class="player_stat flex flex-col">
				<div class="win" data-win-count="0"></div>
				<div class="lose" data-lose-count="300"></div>
			</div>
			<img src="https://cdn.intra.42.fr/users/smaccary.jpg" class="player_image flex" />
		</div>
	</div>
	<div v-else class="flex center_game">
		<Game :menuid="game" />
	</div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
	name: "GameMenu",
	data() {
		return {
			local: Number,
			flappypong: Number,
			gamemode: 0,
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
			this.gamemode = 1;
			setTimeout(() => (this.gamemode = false), 5000);
		},
	},
});
</script>

<style>
.diagonal {
	background: linear-gradient(108deg, transparent calc(50% - 4px), white calc(50% - 4px), white 50%, transparent 50%);
}

.versus_display {
	position: relative;
	width: 100%;
	height: 100%;
	color: white;
}

.top_left,
.bottom_right {
	width: 60vw;
	height: unset;
	position: absolute;
}

.top_left {
	top: 0;
	left: 0;
}

.bottom_right {
	bottom: 0;
	right: 0;
}

.player_stat {
	padding: 20px;
	flex-grow: 1;
	justify-content: center;
	width: 50%;
	text-transform: uppercase;
	font-size: 150%;
}

.player_name {
	flex-basis: 100%;
	font-size: 200%;
	text-transform: uppercase;
	text-align: center;
	display: grid;
	align-content: center;
}

.player_stat > .win::after {
	content: " wins";
}

.player_stat > .lose::after {
	content: " losses";
}

.top_left > .player_image,
.top_left > .player_name {
	justify-content: left;
}

.top_left > .player_image,
.top_left > .player_name,
.top_left > .player_stat {
	text-align: left;
	align-items: start;
	flex-grow: 1;
}

.bottom_right > .player_image,
.bottom_right > .player_name {
	justify-content: right;
}

.bottom_right > .player_image,
.bottom_right > .player_stat {
	text-align: right;
	align-items: end;
	flex-grow: 1;
}

.player_stat > .win[data-win-count="0"]::after,
.player_stat > .win[data-win-count="1"]::after {
	content: " win";
}

.player_stat > .lose[data-lose-count="0"]::after,
.player_stat > .lose[data-lose-count="1"]::after {
	content: " loss";
}

.player_stat > .win[data-win-count]::before {
	content: attr(data-win-count);
}

.player_stat > .lose[data-lose-count]::before {
	content: attr(data-lose-count);
}

@media screen and (max-aspect-ratio: 1/1) {
	.top_left,
	.bottom_right {
		height: 50vh;
		width: unset;
		aspect-ratio: 0.5;
	}

	.top_left .player_stat {
		order: 3;
	}

	.bottom_right .player_stat {
		order: -1;
		justify-content: end;
	}

	.top_left .player_name,
	.bottom_right .player_name {
		justify-content: center;
	}
}

.player_image {
	aspect-ratio: 1;
	width: 30%;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	border-radius: 50%;
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
