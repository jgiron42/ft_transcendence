<template>
	<div v-if="selection == 1" id="admin-panel" class="h-full flex flex-col gap-2">
		<div id="title">
			<hr />
			<div class="panel-title">Admin Panel</div>
			<hr />
		</div>
		<br />
		<div id="admin-list">
			<ArrowDropdown name="admins users" :click="onShowAdmin" :state="showAdmin" />
			<ListUsers
				v-if="showAdmin && adminConnections.length !== 0"
				:connections="adminConnections"
				:margin="true"
			/>
		</div>
		<hr />
		<div id="ban-list">
			<ArrowDropdown name="banned users" :click="onShowBanned" :state="showBanned" />
			<ListUsers
				v-if="showBanned && bannedConnections.length !== 0"
				:connections="bannedConnections"
				:margin="true"
			/>
			<div v-else-if="showBanned" class="empty-text">No banned users.</div>
		</div>
		<hr />
		<div id="mute-list">
			<ArrowDropdown name="muted users" :click="onShowMuted" :state="showMuted" />
			<ListUsers
				v-if="showMuted && mutedConnections.length !== 0"
				:connections="mutedConnections"
				:margin="true"
			/>
			<div v-else-if="showMuted" class="empty-text">No muted users.</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { chatStore } from "@/store";
import { ChannelRole } from "@/models/ChanConnection";

export default Vue.extend({
	name: "AdminPanel",
	props: {
		selection: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			get currentChannel() {
				return chatStore.currentChannel;
			},
			get adminConnections() {
				return chatStore.chanConnections.filter((connection) =>
					[ChannelRole.OWNER, ChannelRole.ADMIN].includes(connection.role),
				);
			},
			get bannedConnections() {
				return chatStore.chanConnections.filter((connection) => connection.role === ChannelRole.BANNED);
			},
			get mutedConnections() {
				return chatStore.chanConnections.filter((connection) => connection.muted);
			},
			showAdmin: true,
			showBanned: true,
			showMuted: true,
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
	},
});
</script>

<style scoped>
.empty-text {
	color: #d5d5d5;
	padding-left: 28px;
}

hr {
	border-color: #555;
}
</style>
