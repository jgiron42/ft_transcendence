<template>
	<Game />
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
	layout: "game",
});
</script>

<style>
body {
	scroll-behavior: smooth;
	background-color: bg-design_gray;
	@apply bg-design_dgray;
}
</style>
