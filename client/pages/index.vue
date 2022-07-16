<template>
	<div class="flex flex-col h-full justify-center items-center">
		<Auth />
		<box-slot>
			<NuxtLink to="/settings/security">Go to settings</NuxtLink>
		</box-slot>
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
