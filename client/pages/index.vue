<template>
	<div id="app" class="w-screen overflow-hidden flex flex-col h-full">
		<Header />
		<div id="page" class="flex flex-row items-center content-center justify-evenly overflow-x-auto h-full">
			<div class="w-fit h-full w-2/5">
				<Settings />
			</div>
			<div>
				<GameDispatcher />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import GameDispatcher from "@/components/GameDispatcher.vue";
export default {
	name: "Index",
	components: { GameDispatcher },
	methods: {},
};
</script>

<style>
html,
body,
#__nuxt,
#__layout {
	scroll-behavior: smooth;
	background-color: bg-design_gray;
	touch-action: manipulation;
	-webkit-tap-highlight-color: transparent;
	height: 100%;
	width: 100%;
	margin: 0;
	padding: 0;
	overflow-x: hidden;

	@apply bg-design_dgray;
}
</style>
