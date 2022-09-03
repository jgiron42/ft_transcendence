<template>
	<div
		class="w-full h-full flex flex-col items-center border-4 border-design_white bg-design_history_gray overflow-hidden rounded-md"
	>
		<!-- Title -->
		<div
			id="title"
			class="items-center text-design_white h-8 justify-center top-1/2 flex w-full border-b-2 border-design_white text-center bg-design_blue"
		>
			<div class="inline-block align-center uppercase">Leaderboard</div>
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
	}),
	mounted() {
		this.fetchTopladder();
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
	},
});
</script>
