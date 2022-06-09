<template>
	<div id="app" class="w-screen h-screen overflow-hidden flex flex-col">
		<Header />
		<div id="page" class="flex flex-row items-center flex-grow min-h-0 min-w-0 overflow-x-auto">
			<div class="flex w-1/2 h-1/2">
				<Settings />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
export default {
	name: "Index",
	methods: {},
};
</script>

<style>
body {
	scroll-behavior: smooth;
	background-color: bg-design_gray;
	@apply bg-design_dgray;
}
</style>
