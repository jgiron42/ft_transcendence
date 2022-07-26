<template>
	<div class="versus_display diagonal w-full h-full overflow-hidden">
		<div class="flex top_left flex-row flex-wrap m-2">
			<div class="player_name flex">{{ self }}</div>
			<figure class="w-full">
				<img v-if="selfImg" :src="selfImg" class="player_image" />
				<img v-else src="~/assets/profile.png" class="player_image" />
			</figure>
			<div class="player_stat flex flex-col">
				<div class="win" data-win-count="300"></div>
				<div class="lose" data-lose-count="0"></div>
			</div>
		</div>
		<p style="margin: 48vh auto 0; transform: translateY(-50%)" class="versus_text">VS</p>
		<div class="flex bottom_right flex-row flex-wrap m-2">
			<div class="player_name flex">{{ opponent }}</div>
			<figure class="w-full">
				<img v-if="opponentImg" :src="opponentImg" class="player_image float-right" />
				<img v-else src="~/assets/profile.png" class="player_image float-right" />
			</figure>
			<div class="player_stat flex flex-col">
				<div class="win" data-win-count="0"></div>
				<div class="lose" data-lose-count="300"></div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import getUserPictureSrc from "~/utils/getUserPictureSrc";
export default Vue.extend({
	props: {
		self: {
			type: String,
			required: true,
		},
		opponent: {
			type: String,
			required: true,
		},
	},
	data: () => ({
		selfImg: "",
		opponentImg: "",
	}),
	mounted() {
		getUserPictureSrc(this.$axios, this.self)
			.catch()
			.then((img) => (this.selfImg = img));
		getUserPictureSrc(this.$axios, this.opponent)
			.catch()
			.then((img) => (this.opponentImg = img));
	},
});
</script>

<style>
.diagonal {
	background: linear-gradient(
		-12deg,
		black,
		transparent calc(50% - 4px),
		#464646 calc(50% - 4px),
		#353535 50%,
		transparent 50%,
		black
	);
}

@media screen and (max-width: 500px) {
	.versus_text {
		font-size: 4.5rem; /* 72px */
		line-height: 1;
	}
}

@media screen and (min-width: 500px) {
	.versus_text {
		font-size: 8rem; /* 128px */
		line-height: 1;
	}
}

.versus_display {
	position: relative;
	width: 100%;
	height: 100%;
	color: white;
}

.top_left,
.bottom_right {
	width: 60%;
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
	max-width: 30%;
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
