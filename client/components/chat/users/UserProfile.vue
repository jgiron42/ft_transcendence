<template>
	<div class="text-white flex flex-col pl-8 pr-8 gap-4">
		<div class="flex flex-col">pseudo: {{ user.username }}</div>
		<div class="flex flex-col">nb games : {{ user.nb_game }}</div>
		<div class="flex flex-col">nb wins : {{ user.nb_win }}</div>
		<div class="flex flex-col">ratio : {{ nb_wins / nb_game }}</div>
		<div class="flex flex-row">
			<button v-if="friend" class="button_profile" @click.prevent="addFriend">friend request</button>
			<button v-else class="button_profile" @click.prevent="removeFriend">remove friend</button>
			<button class="button_profile" @click.prevent="blockUser">block {{ pseudo }}</button>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { userProfile } from "@/store";

export default Vue.extend({
	name: "UserProfile",
	data() {
		return {
			get user() {
				return userProfile.user;
			},
			pseudo: "pseudo test",
			nb_game: 3,
			nb_win: 0,
			nb_lose: 3,
			ratio: 0,
			friend: false,
		};
	},
	methods: {
		addFriend() {
			console.log("ADD friend");
		},
		removeFriend() {
			console.log("REMOVE friend");
		},
		blockUser() {
			console.log("Block User");
		},
	},
});
</script>

<style scoped>
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
</style>
