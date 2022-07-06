<template>
	<div id="admin-panel" class="h-full">
		<ArrowDropdown name="admins list" />
		<ArrowDropdown name="banned users" />
		<ArrowDropdown name="mute users" />
	</div>
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
