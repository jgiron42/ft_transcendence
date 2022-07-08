<template>
	<div>
		<div class="scroll_menu bg-design_black text-design_white flex flex-row">
			<button @click.prevent="isActive = !isActive">
				<Logo />
			</button>
			<div v-if="isActive === true" class="scroll_menu flex flex-row">
				<NuxtLink class="selection_menu" to="/homepage">Homepage</NuxtLink>
				<NuxtLink class="selection_menu" to="/homepage">Pong</NuxtLink>
				<NuxtLink class="selection_menu" to="/homepage">Social Network</NuxtLink>
				<NuxtLink class="selection_menu" to="/homepage">Profile</NuxtLink>
			</div>
		</div>
		<div class="border-design_white border-b border-2"></div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
	data() {
		return {
			isActive: false,
		};
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
