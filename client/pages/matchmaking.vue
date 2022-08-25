<template>
	<div class="h-full w-full flex justify-center items-center text-center overflow-y-scroll no-scrollbar">
		<div :class="`${$device.isMobile ? 'w-full h-full' : 'w-1/2 h-5/6'}`">
			<Matchmaking />
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
	layout: "no-mobile-header",
});
</script>
