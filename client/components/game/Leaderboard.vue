<template>
	<div
		class="w-full h-full flex flex-col items-center border-4 border-design_white bg-design_history_gray overflow-hidden rounded-md"
	>
		<!-- Title -->
		<div
			id="title"
			class="items-center text-design_white h-8 justify-center top-1/2 flex w-full border-b-2 border-design_white text-center bg-design_blue"
		>
			<div class="inline-block align-center uppercase">Leaderboard - Top 10</div>
		</div>

		<div v-if="loaded" class="text-white overflow-y-scroll w-full h-full no-scrollbar items-center flex flex-col">
			<div
				v-for="(user, index) in topLadder"
				:key="user.id"
				style="width: 98%"
				class="cursor-pointer p-2 my-1 rounded-md bg-design_black flex flex-row font-mono"
				@click="showProfile(user)"
			>
				<div class="pl-2">#{{ index + 1 }}</div>
				<div class="items-center w-full pr-6">
					<p class="w-1/6 overflow-scroll truncate no-scrollbar">{{ user.username }} - {{ user.elo }}</p>
				</div>
			</div>
		</div>

		<!-- Spinny loader while requests responds -->
		<Loader v-else class="mx-auto animate-spin h-full" />

		<div v-if="me.id !== undefined" id="personal-rank" class="w-full">
			<div class="text-white text-center w-full">
				<div class="table w-full pt-1">
					<div class="table-cell text-sm align-middle">YOU</div>
				</div>
				<div
					class="cursor-pointer p-2 my-1 rounded-md bg-design_black flex flex-row font-mono"
					@click="showProfile(me)"
				>
					<div class="pl-2">#{{ me.rank }}</div>
					<div class="items-center w-full pr-6">
						<p class="w-1/6 overflow-scroll truncate no-scrollbar">{{ me.username }} - {{ me.elo }}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { User } from "@/models/User";
import { store } from "@/store";

export default Vue.extend({
	data: () => ({
		loaded: false,
		topLadder: [] as User[],
		me: {} as User,
	}),
	mounted() {
		this.fetchTopladder();
		this.fetchPersonalRank();
	},
	methods: {
		showProfile(user: User) {
			store.popup.setUser(user);
			this.$modal.show("user_profile");
		},
		async fetchTopladder() {
			await this.$axios
				.get("/users", { params: { sort: "elo" } })
				.then((response) => {
					this.topLadder = response.data;
					this.loaded = true;
				})
				.catch((error) => {
					this.alert.emit({ title: "LEADERBOARD", message: error.toString() });
					this.loaded = true;
				});
		},
		async fetchPersonalRank() {
			await this.$axios
				.get(`/me`)
				.then((response) => {
					this.me = response.data;
				})
				.catch((error) => {
					this.alert.emit({ title: "LEADERBOARD", message: error.toString() });
				});
		},
	},
});
</script>

<style scoped>
#personal-rank {
	background-color: #2d2d2d;
}
</style>
