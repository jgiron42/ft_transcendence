<template>
	<div class="w-full h-full">
		<button @click="createChannel">Create channel</button>
		<div v-if="channel.type == 1">channel</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
	name: "CreateChannel",
	data() {
		return {
			channel: {
				name: "houhou",
				type: 0,
			},
		};
	},
	methods: {
		createChannel() {
			this.channel.type = 1;
		},
	},
});
</script>
