<template>
	<div class="profile_container text-white flex flex-col pl-8 pr-8 gap-4">
		<!-- spacer -->
		<div class="flex flex-col"></div>
		<div v-if="is_you" class="flex flex-col">
			<SearchInput />
		</div>
		<div v-else class="flex flex-col" @click="backCurrent">BACK</div>
		<div class="flex flex-col pfp">
			<ProfileLogo />
		</div>
		<div class="flex flex-col">pseudo: {{ pseudo }}</div>
		<div v-if="status === 1" class="flex flex-col">status : online</div>
		<div v-if="status === 2" class="flex flex-col">status : playing</div>
		<div v-if="status === 0" class="flex flex-col">status : offline</div>
		<div id="pie" class="pie flex flex-col"></div>
		<div class="flex flex-col">ratio : {{ ratio }}%</div>
		<div class="flex flex-col">played games : {{ nb_game }}</div>
		<div class="flex flex-col">wins : {{ nb_win }}</div>
		<div v-if="!is_you" class="flex flex-col">
			<button v-if="friend" class="button_profile" @click.prevent="addFriend">friend request</button>
			<button v-else class="button_profile" @click.prevent="removeFriend">remove friend</button>
		</div>
		<div v-if="!is_you" class="flex flex-col">
			<button class="button_profile" @click.prevent="blockUser">block {{ pseudo }}</button>
		</div>
		<div v-if="status === 2" class="flex flex-col">
			<button class="button_profile" @click.prevent="spectateUser">spectate</button>
		</div>
		<div v-if="is_you" class="flex flex-col">
			<NuxtLink to="/settings"></NuxtLink>
			<button class="button_profile" @click.prevent="userSettings">
				<NuxtLink to="/settings/profile">settings</NuxtLink>
			</button>
		</div>
		<!-- spacer -->
		<div class="flex flex-col"></div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
	name: "UserProfile",
	data() {
		return {
			is_you: false, // this will display the setting button if the player you're looking is you
			pie: null,
			pseudo: "pseudo test",
			nb_game: 3,
			nb_win: 1,
			nb_lose: 3,
			status: 2, // 0 offline, 1 online, 2 playing
			ratio: 90,
			friend: false,
		};
	},
	mounted() {
		// set PieChart value
		this.ratio = Math.floor((this.nb_win / this.nb_game) * 100);
		document.getElementById("pie").style.setProperty("--p", this.ratio + 1);
	},
	methods: {
		addFriend() {
			// console.log("ADD friend");
		},
		removeFriend() {
			// console.log("REMOVE friend");
		},
		blockUser() {
			//  console.log("Block User");
		},
		spectateUser() {
			// console.log("spectate User");
		},
		backCurrent() {
			this.is_you = true;
		},
	},
});
</script>

<style>
.button_profile {
	overflow: hidden;
	color: black;
	font: 1em "Open Sans", sans-serif;
	width: 100%;
	padding: 10px;
	border-radius: 10px;
	margin-bottom: 5px;
	margin-left: 2px;
	margin-right: 2px;
	text-align: center;
	background-color: #cecece;
	display: inline;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.profile_container {
	background: #1b1b1b;
	justify-content: center;
	align-items: center;
	border-radius: 10px;
	border-style: solid;
	border-color: #292929;
}

input {
	color: black;
}

img {
	margin: auto;
	width: 86px;
	height: 86px;
}

.pfp {
	width: 86px;
	min-height: 86px;
	max-height: auto;
	float: left;
	margin: 3px;
	padding: 3px;
	border-radius: 10px;
}

.pie {
	--w: 86px;
	--c: #a7eb19;
	--b: 10px;
	--p: 90;

	border-radius: 50%;
	inset: 0;
	width: var(--w);
	aspect-ratio: 1;
	display: inline-grid;
	place-content: center;
	margin: 5px;
	background: conic-gradient(var(--c) calc(var(--p) * 1%), #0000 0);
	mask: radial-gradient(farthest-side, #0000 calc(99% - var(--b)), #000 calc(100% - var(--b)));
}
</style>
