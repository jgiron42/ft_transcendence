<template>
	<div class="h-full bg-design_black">
		<div id="header" class="bg-design_black text-design_white flex flex-row md:h-16">
			<NuxtLink class="header-item selection_menu" to="/">
				<Logo />
			</NuxtLink>
			<div v-if="connected !== ''" id="scroll_menu" class="md:!w-full md:!flex md:!flex-row md:!visible">
				<NuxtLink class="selection_menu" to="/matchmaking">Pong</NuxtLink>
				<NuxtLink class="selection_menu" to="/chat">Social Network</NuxtLink>
				<NuxtLink class="selection_menu" to="/profile">Profile</NuxtLink>
				<NuxtLink class="selection_menu" to="/leaderboard">Leaderboard</NuxtLink>
				<p class="block mt-auto mb-auto pr-2 font-mono">{{ username }}</p>
			</div>
			<div id="header-mini" class="w-full md:!hidden md:!invisible">
				<div class="header-item flex justify-center">
					<button class="mt-auto mb-auto text-4xl text-center" @click="showMenu = true">≡</button>
				</div>
				<div
					id="nav-context"
					class="left-0 absolute z-10"
					:class="showMenu ? '' : 'hide-menu'"
					@click.self="showMenu = false"
				>
					<div class="relative w-40 h-full bg-design_black ml-auto">
						<p class="block mt-auto mb-auto pr-2 w-full text-center font-mono">{{ username }}</p>
						<div class="flex flex-col" @click="showMenu = false">
							<NuxtLink class="selection_menu" to="/matchmaking">Pong</NuxtLink>
							<NuxtLink class="selection_menu" to="/chat">Social Network</NuxtLink>
							<NuxtLink class="selection_menu" to="/profile">Profile</NuxtLink>
							<NuxtLink class="selection_menu" to="/leaderboard">Leaderboard</NuxtLink>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="border-design_white border-b border-2"></div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { store } from "@/store";

export default Vue.extend({
	data: () => ({
		connected: true,
		showMenu: false,
		get username() {
			return store.user.me.username;
		},
		nav: {} as HTMLElement | null,
	}),
	mounted() {
		this.nav = document.getElementById("nav-context");
		window.addEventListener("resize", this.getDimensions);
		this.getDimensions();
	},
	methods: {
		getDimensions() {
			if (this.nav !== null) {
				this.nav.style.height = `${window.innerHeight}px`;
				this.nav.style.width = `${window.innerWidth}px`;
			}
		},
	},
});
</script>

<style>
#header {
	background-color: design-black;
	overflow: hidden;
	width: 100%;
	height: 50px;
	white-space: nowrap;
	vertical-align: center;
}

#header-mini {
	width: 100%;
	display: flex;
	justify-content: flex-end;
}

#scroll_menu {
	display: none;
	visibility: hidden;
}

#dropdown-menu {
}

#nav-context {
	backdrop-filter: blur(5px);
	background-color: #0007 !important;
	margin-right: auto;
}

.header-item {
	width: 70px !important;
}

.center_elem {
	position: center;
	vertical-align: bottom;
}

.selection_menu {
	width: 100%;
	height: 100%;
	margin-right: auto;
	padding: 20px;
	font: 1em "Open Sans", sans-serif;
	display: grid;
	align-content: center;
	justify-content: center;
	border: 5px solid transparent;
}

.selection_menu:hover {
	border: 5px solid grey;
}

.hide-menu {
	display: none;
	visibility: hidden;
}
</style>
