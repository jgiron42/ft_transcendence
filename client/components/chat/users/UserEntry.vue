<template>
	<div class="user-entry">
		<div v-if="size === 'small'" class="user-entry-small">
			<div class="flex gap-1">
				<button class="user-button cut-text btn text-left" @click="show_profile">
					<b>{{ user.id }}</b>
				</button>
			</div>
		</div>
		<div v-else-if="size === 'medium'" class="user-entry-medium">
			<button class="user-button-medium flex gap-1" @click="show_profile">
				<img class="user-avatar" :src="imageUrl" :alt="user.id + ' avatar'" />
				<b>{{ user.id }}</b>
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import vue from "vue";
import { store } from "~/utils/store-accessor";

export default vue.extend({
	name: "UserEntry",
	props: {
		user: {
			type: Object,
			required: true,
		},
		size: {
			type: String,
			default: "small",
		},
	},
	data: () => ({
		imageUrl: "",
	}),
	mounted() {
		if (this.size === "medium") this.imageUrl = this.$nuxt.$getPictureSrc(this.user.id);
	},
	methods: {
		show_profile() {
			// set the user on the popup store
			store.popup.setUser(this.user);

			// show the user profile popup
			this.$modal.show("user_profile");
		},
	},
});
</script>

<style scoped>
.user-button {
	padding-left: 0.75em;
	color: #bdbdbd;
	font: 0.9em "Open Sans", sans-serif;
	width: 95%;
	margin: auto;
	border-radius: 5px;
}

.user-button:hover {
	background-color: #393939;
	color: #999;
}

.user-entry-medium {
	padding-top: 0.5em;
	margin: auto;
}

.user-button-medium {
	padding: 0.75em;
	color: #bdbdbd;
	background-color: #2c3548;
	width: 95%;
	margin: auto;
	border-radius: 1em;
}

.user-button-medium:hover {
	background-color: #393939;
	color: #999;
}

.user-avatar {
	aspect-ratio: 1;
	border-radius: 50%;
	width: 15%;
}

.user-entry {
}
</style>
