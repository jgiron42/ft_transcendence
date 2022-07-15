<template>
	<div v-if="selection == 1" id="admin-panel" class="h-full flex flex-col gap-2">
		<div id="title">
			<hr />
			<div class="panel-title">Admin Panel</div>
			<hr />
		</div>
		<br />
		<div id="channel-prop">
			<ArrowDropdown name="channel properties" :click="onShowChanProps" :state="showChanProps" />
			<div v-if="showChanProps" class="">
				<EditChannel />
			</div>
		</div>
		<div id="admin-list">
			<ArrowDropdown name="admins users" :click="onShowAdmin" :state="showAdmin" />
			<ListUsers
				v-if="showAdmin && adminConnections.length !== 0"
				:connections="adminConnections"
				:margin="true"
			/>
			<div v-if="isOwner">
				<button v-if="!showEditAdmin" class="edit-button" @click="editAdmin">Manage admins</button>
				<button v-if="showEditAdmin" class="edit-button" @click="saveEditAdmin">Save!</button>
				<ListUsers
					v-if="showEditAdmin && usersInChannel.length !== 0"
					:connections="usersInChannel"
					:pre-selected="adminConnections"
					:margin="true"
					type="admin-selection"
					@select="selectAdmin"
				/>
			</div>
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
			<div v-if="isAdmin">
				<button v-if="!showEditBanned" class="edit-button" @click="editBanned">Manage banned</button>
				<button v-if="showEditBanned" class="edit-button" @click="saveEditBanned">Save!</button>
				<ListUsers
					v-if="showEditBanned && usersInChannel.length !== 0"
					:connections="usersInChannelExceptOwner"
					:pre-selected="bannedConnections"
					:margin="true"
					type="banned-selection"
					@select="selectBanned"
				/>
			</div>
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
import { ChanConnection, ChannelRole } from "@/models/ChanConnection";

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
			get usersInChannel() {
				return chatStore.chanConnections;
			},
			get usersInChannelExceptOwner() {
				return chatStore.chanConnections.filter((connection) => connection.role !== ChannelRole.OWNER);
			},
			get isOwner(): boolean {
				return chatStore.roleOnCurrentChannel === ChannelRole.OWNER;
			},
			get isAdmin(): boolean {
				return chatStore.roleOnCurrentChannel >= ChannelRole.ADMIN;
			},
			selectedAdmins: [] as ChanConnection[],
			selectedBanned: [] as ChanConnection[],
			showChanProps: true,
			showAdmin: true,
			showEditAdmin: false,
			showBanned: true,
			showEditBanned: false,
			showMuted: true,
		};
	},
	mounted() {
		this.selectedAdmins = [];
		this.selectedBanned = [];
		for (const connection of this.adminConnections) {
			this.selectedAdmins.push(connection);
		}
		for (const connection of this.bannedConnections) {
			this.bannedConnections.push(connection);
		}
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
		onShowChanProps() {
			this.showChanProps = !this.showChanProps;
		},
		editAdmin() {
			this.showEditAdmin = true;
		},
		saveEditAdmin() {
			for (const connection of this.selectedAdmins) {
				if (connection.role !== ChannelRole.ADMIN && connection.role !== ChannelRole.OWNER) {
					const _con = { id: connection.id, role: ChannelRole.ADMIN } as ChanConnection;
					this.chat.chanConnection.updateChanConnection(_con);
				}
			}
			for (const connection of this.adminConnections) {
				if (!this.selectedAdmins.includes(connection)) {
					const _con = { id: connection.id, role: ChannelRole.USER } as ChanConnection;
					this.chat.chanConnection.updateChanConnection(_con);
				}
			}
			this.selectedAdmins = [];
			this.showEditAdmin = false;
		},
		selectAdmin(connections: ChanConnection[]) {
			this.selectedAdmins = connections;
		},
		editBanned() {
			this.showEditBanned = true;
		},
		saveEditBanned() {
			console.log("banned: " + JSON.stringify(this.selectedBanned, null, 4));
			for (const connection of this.selectedBanned) {
				if (connection.role !== ChannelRole.OWNER) {
					const _con = { id: connection.id, role: ChannelRole.BANNED } as ChanConnection;
					this.chat.chanConnection.updateChanConnection(_con);
				}
			}
			for (const connection of this.bannedConnections) {
				if (!this.selectedBanned.includes(connection)) {
					const _con = { id: connection.id, role: ChannelRole.USER } as ChanConnection;
					this.chat.chanConnection.updateChanConnection(_con);
				}
			}
			this.selectedBanned = [];
			this.showEditBanned = false;
		},
		selectBanned(connections: ChanConnection[]) {
			this.selectedBanned = connections;
		},
	},
});
</script>

<style scoped>
.empty-text {
	color: #d5d5d5;
	padding-left: 28px;
}

.sub-content {
	padding-left: 28px;
}

hr {
	border-color: #555;
}

.edit-button {
	font: 0.75em "Open Sans", sans-serif;
	border-radius: 5px;
	color: #222;
	font-weight: bold;
	background-color: #666;
	margin-left: auto;
	margin-right: 0;
	display: block;
	padding: 0.25em 0.5em;
}
</style>
