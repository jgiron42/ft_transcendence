<template>
	<div id="admin-panel" class="h-full">Admin panel</div>
</template>

<script lang="ts">
import Vue from "vue";
import { chatStore } from "@/store";

export default Vue.extend({
	name: "AdminPanel",
	data() {
		return {
			get currentChannel() {
				return chatStore.currentChannel;
			},
		};
	},
	methods: {},
});
</script>
