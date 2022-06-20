<template>
	<div id="app" class="w-screen h-screen overflow-hidden flex flex-col">
		<Header />
		<div id="page" class="flex flex-row items-center flex-grow min-h-0 min-w-0 overflow-x-auto">
			<div class="flex w-1/2 h-1/2">
				<Settings />
			</div>
		</div>
		<Game />
	</div>
</template>

<script lang="ts">
// import lol from "@/plugins/my-plugin2.js"
import Vue from "vue";
import Game from "~/components/Game.vue";

export default Vue.extend({
    name: "Index",
    mounted() {
        this.$myInjectedFunction();
    },
    methods: {},
    components: { Game }
});
</script>

<style>
body {
	scroll-behavior: smooth;
	background-color: bg-design_gray;
	@apply bg-design_dgray;
}
</style>
