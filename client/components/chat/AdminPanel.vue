<template>
	<div id="admin-panel" class="h-full">
		<ArrowDropdown name="admins list" :click="onShowAdmin" />
		<ListUsers v-if="showAdmin" :connections="adminConnections" />
		<ArrowDropdown name="banned users" :click="onShowBanned" />
		<ListUsers v-if="showBanned" :connections="bannedConnections" />
		<ArrowDropdown name="mute users" :click="onShowMuted" />
		<ListUsers v-if="showMuted" :connections="mutedConnections" />
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
			get adminConnections() {
				return chatStore.chanConnections;
			},
			get bannedConnections() {
				return chatStore.chanConnections;
			},
			get mutedConnections() {
				return chatStore.chanConnections;
			},
			showAdmin: false,
			showBanned: false,
			showMuted: false,
		};
	},
	methods: {
		onShowAdmin() {
			this.showAdmin = !this.showAdmin;
		},
		onShowBanned() {
			this.showBanned = !this.showBanned;
		},
		onShowMuted() {
			this.showMuted = !this.showMuted;
		},
		test() {
			console.log("coucou");
		},
	},
});
</script>
