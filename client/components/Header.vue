<template>
	<div>
		<div class="scroll_menu bg-design_black text-design_white flex flex-row">
			<button @click.prevent="isActive = !isActive">
				<Logo />
			</button>
			<div v-if="isActive === true && connected === true" class="scroll_menu flex flex-row">
				<NuxtLink class="selection_menu" to="/">Homepage</NuxtLink>
				<NuxtLink class="selection_menu" to="/matchmaking">Pong</NuxtLink>
				<NuxtLink class="selection_menu" to="/chat">Social Network</NuxtLink>
				<NuxtLink class="selection_menu" to="/profile">Profile</NuxtLink>
				<p>{{ userID }}</p>
			</div>
		</div>
		<div class="border-design_white border-b border-2"></div>
	</div>
</template>

<script lang="ts">
import { Context } from "@nuxt/types";
import Vue from "vue";
import { UserSingleton } from "~/models/User";
export default Vue.extend({
	data: () => ({
		isActive: true,
		connected: true,
		userID: "",
	}),
	mounted() {
		const singleton = new UserSingleton({
			$axios: this.$axios,
			store: this.$store,
			redirect: (url: string) => {
				this.$router.push(url);
			},
			$config: this.$config,
		} as Context);
		singleton.getUser().then((user) => (this.userID = user.id));
	},
});
</script>

<style>
.center_elem {
	position: center;
	vertical-align: bottom;
}

.scroll_menu {
	background-color: design-black;
	overflow: auto;
	width: 100%;
	height: 70px;
	white-space: nowrap;
	vertical-align: center;
}

.selection_menu {
	width: 100%;
	height: 100%;
	margin-right: auto;
	margin-left: auto;
	padding: 20px;
	font: 1em "Open Sans", sans-serif;
	display: grid;
	align-content: center;
	justify-content: center;
}

.selection_menu:hover {
	border: 5px solid grey;
}
</style>
