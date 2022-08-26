<template>
	<div
		class="w-full h-full flex flex-col items-center border-4 border-design_white bg-design_history_gray overflow-hidden rounded-md"
	>
		<!-- Title -->
		<div
			id="title"
			class="items-center text-design_white h-8 justify-center top-1/2 flex w-full border-b-2 border-design_white text-center bg-design_blue"
		>
			<div class="inline-block align-center uppercase">{{ userID }}'s HISTORY</div>
		</div>
		<!-- Loaded content -->
		<div v-if="loaded" class="text-white overflow-y-scroll w-full h-full no-scrollbar items-center flex flex-col">
			<!-- Match list -->
			<div
				v-for="match in matchList"
				:key="match.id"
				style="width: 98%"
				class="p-2 my-1 rounded-md bg-design_black flex flex-row justify-around font-mono items-center"
			>
				<!-- Player 1 ID -->
				<p class="match-user-id no-scrollbar">{{ match.user_one.id }}</p>

				<!-- Player 1 picture -->
				<object
					class="rounded-full w-10 h-10"
					:data="`/api/users/${match.user_one.id}/picture`"
					type="image/png"
				>
					<img class="rounded-full w-10 h-10" src="~/assets/profile.png" />
				</object>

				<!-- Game's final score -->
				<p>{{ match.score_first_player }} - {{ match.score_second_player }}</p>

				<!-- Player 2 picture -->
				<object
					class="rounded-full w-10 h-10"
					:data="`/api/users/${match.user_two.id}/picture`"
					type="image/png"
				>
					<img class="rounded-full w-10 h-10" src="~/assets/profile.png" />
				</object>

				<!-- Player 2 ID -->
				<p class="match-user-id no-scrollbar">{{ match.user_two.id }}</p>
			</div>
		</div>

		<!-- Spinny loader while requests responds -->
		<Loader v-else class="mx-auto animate-spin h-full" />

		<!-- Next/Previous page buttons -->
		<div
			id="page-buttons"
			class="text-design_white h-8 flex w-full justify-center items-center text-center content-center m-4"
		>
			<!-- Previous page button, only displayer when not on first page  -->
			<button v-if="page > 1" class="page-button" @click="fetchPreviousPage">&lt;</button>

			<!-- Next page button, only displayer when not on last page  -->
			<button v-if="matchList.length >= per_page" class="page-button" @click="fetchNextPage">&gt;</button>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
	props: {
		pageProp: {
			type: Number,
			default: () => 1,
		},
		userID: {
			type: String,
			required: true,
		},
	},
	data: () => ({
		matchList: [],
		page: 1,
		per_page: 9,
		loaded: false,
	}),
	mounted() {
		// Init page number (API route is paginated)
		this.page = this.pageProp;

		// Fetch the games list.
		this.fetchPage(this.page);
	},
	methods: {
		fetchPage(n: number) {
			// Query nth games page from API
			this.$axios
				.get(`/users/${this.userID}/games`, { params: { page: n, per_page: this.per_page } })
				.then((response) => {
					// Update displayer games
					this.matchList = response.data;

					// Hide the loader and display the data.
					this.loaded = true;
				})
				.catch((err) => {
					// Log and display the error
					this.alert.emit({ title: "HISTORY", message: err.toString() });

					// Hide the loader.
					this.loaded = true;
				});
		},
		fetchPreviousPage() {
			// Ensure we're not fetching before the first page.
			this.page = this.page > 1 ? this.page - 1 : this.page;

			// Fetch the games list from API.
			this.fetchPage(this.page);

			// Update the current URL parameters (ensures accurate refresh + copy and paste)
			history.replaceState({}, "", window.location.pathname + `?page=${this.page}`);
		},
		fetchNextPage() {
			// Ensure we're not fetching past the last page.
			if (this.matchList.length >= this.per_page) {
				// Fetch the games list from API.
				this.fetchPage(++this.page);

				// Update the current URL parameters (ensures accurate refresh + copy and paste)
				history.replaceState({}, "", window.location.pathname + `?page=${this.page}`);
			}
		},
	},
});
</script>

<style scoped>
.page-button {
	@apply hover:text-gray-500 mx-10 bg-design_black p-1 w-1/5 rounded-lg text-4xl font-mono m-1 h-full box-content text-center content-center items-center flex justify-center;
}

.match-user-id {
	@apply w-1/6 overflow-scroll truncate;
}
</style>
