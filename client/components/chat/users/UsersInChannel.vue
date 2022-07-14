<template>
	<div v-if="selection == 0" id="user-selection" class="h-full flex flex-col gap-2">
		<div id="title">
			<hr />
			<div id="chan-name" class="panel-title">Channel: {{ currentChannel.name }}</div>
			<hr />
		</div>
		<br />
		<div id="users-list">
			<ArrowDropdown name="users" :click="onShowUsers" :state="showUsers" />
			<ListUsers v-if="showUsers" :margin="true" :connections="chanConnections" />
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { chatStore } from "@/store";

export default Vue.extend({
	name: "UsersInChannel",
	props: {
		selection: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			showUsers: true,
			get chanConnections() {
				return chatStore.chanConnections;
			},
			get currentChannel() {
				return chatStore.currentChannel;
			},
		};
	},
	methods: {
		onShowUsers() {
			this.showUsers = !this.showUsers;
		},
	},
});
</script>

<style scoped>
hr {
	border-color: #555;
}
</style>
