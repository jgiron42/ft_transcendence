<template>
	<div v-if="p1User && p2User" class="versus_display diagonal w-full h-full overflow-hidden">
		<!-- Player 1 -->
		<div class="flex top_left flex-row flex-wrap m-2">
			<!-- Player name -->
			<div class="player_name flex">{{ p1 }}</div>

			<!-- Player picture -->
			<figure class="w-full">
				<img v-if="p1Img" :src="p1Img" class="player_image" />
				<img v-else src="~/assets/profile.png" class="player_image" />
			</figure>

			<!-- Player stats -->
			<div class="player_stat flex flex-col">
				<div class="win" :data-win-count="p1User.nb_win"></div>
				<div class="lose" :data-lose-count="p1User.nb_loss"></div>
			</div>
		</div>

		<!-- VERSUS middle text -->
		<p style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)" class="versus_text">VS</p>

		<!-- Player 2 -->
		<div class="flex bottom_right flex-row flex-wrap m-2">
			<!-- Player name -->
			<div class="player_name flex">{{ p2 }}</div>

			<!-- Player picture  -->
			<figure class="w-full">
				<img v-if="p2Img" :src="p2Img" class="player_image float-right" />
				<img v-else src="~/assets/profile.png" class="player_image float-right" />
			</figure>

			<!-- Player stats -->
			<div class="player_stat flex flex-col">
				<div class="win" :data-win-count="p2User.nb_win"></div>
				<div class="lose" :data-lose-count="p2User.nb_loss"></div>
			</div>
		</div>
	</div>

	<!-- Spinny loader displayed while data isn't received yet -->
	<Loader v-else class="mx-auto animate-spin h-full" />
</template>

<script lang="ts">
import Vue from "vue";
import { User } from "~/models/User";
import getUserPictureSrc from "~/utils/getUserPictureSrc";
export default Vue.extend({
	props: {
		p1: {
			type: String,
			required: true,
		},
		p2: {
			type: String,
			required: true,
		},
	},
	data: () => ({
		p1User: {} as User,
		p2User: {} as User,
		p1Img: "",
		p2Img: "",
	}),
	async mounted() {
		// Set the screen to fullscreen landscape when rendered on mobile devices.
		if (this.$device.isMobileOrTablet) {
			try {
				// Set fullscreen.
				await document.documentElement.requestFullscreen();

				// Set screen orientation to landscape.
				await screen.orientation.lock("landscape");
			} catch (_) {}
		}

		// Get the function to get user informations from database.
		const getUser = async (id: string): Promise<User> => (await this.$axios.get(`/users/${id}`)).data;

		// Get player 1's user.
		getUser(this.p1).then((user: User) => {
			this.p1User = user;
		});

		// Get player 2's user.
		getUser(this.p2).then((user: User) => {
			this.p2User = user;
		});

		// Get player 1's profile picture data.
		getUserPictureSrc(this.$axios, this.p1)
			.then((img) => (this.p1Img = img))
			.catch(() => {});

		// Get player 2's profile picture data.
		getUserPictureSrc(this.$axios, this.p2)
			.then((img) => (this.p2Img = img))
			.catch((_) => {});
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
