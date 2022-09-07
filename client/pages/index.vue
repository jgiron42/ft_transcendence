<template>
	<div class="w-full h-full flex flex-row items-center flex-grow min-h-0 min-w-0 overflow-x-auto">
		<div class="menu_button flex flex-row">
			<NuxtLink to="/profile" class="button_choice flex flex-col">
				<ProfileLogo />
				<div class="text_button">Profile</div>
			</NuxtLink>
			<NuxtLink to="/chat" class="button_choice flex flex-col">
				<ChatLogo />
				<div class="text_button">Social Network</div>
			</NuxtLink>
			<NuxtLink to="/matchmaking" class="button_choice flex flex-col">
				<PongLogo />
				<div class="text_button">Game</div>
			</NuxtLink>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
	name: "Index",
	mounted() {
		this.$gameSocket.init(this.$nuxt.context);
		this.$chatSocket.init(this.$nuxt.context);
	},
});
</script>

<style>
.menu_button {
	background-color: design-black;
	width: 100%;
	white-space: nowrap;
	vertical-align: center;
}

.button_choice {
	margin-right: auto;
	margin-left: auto;
	display: flex;
	width: 10%;
	height: 10%;
}

.button_choice:hover > .text_button {
	color: grey;
}

body {
	scroll-behavior: smooth;
	background-color: bg-design_gray;
	@apply bg-design_dgray;
}

@media screen and (max-aspect-ratio: 1/1) {
	.menu_button {
		flex-flow: column;
		position: fixed;
		overflow: hidden;
	}

	.button_choice {
		height: 15%;
		width: 20%;
		margin-top: 5%;
		margin-bottom: 5%;
	}
}

.text_button {
	display: grid;
	align-content: center;
	color: white;
	font-size: 150%;
	vertical-align: center;
	justify-content: center;
}
</style>
