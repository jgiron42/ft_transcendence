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
					v-if="showEditAdmin"
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
					:connections="usersFilter((connection) => connection.role < ChannelRole.OWNER)"
					:pre-selected="bannedConnections"
					:margin="true"
					type="banned-selection"
					@select="selectBanned"
				/>
			</div>
			<div
				v-if="showEditBanned && usersFilter((connection) => connection.role < ChannelRole.OWNER).length === 0"
				class="empty-text"
			>
				No users.
			</div>
		</div>
		<hr />
		<div id="mute-list">
			<ArrowDropdown name="muted users" :click="onShowMuted" :state="showMuted" />
			<ListUsers
				v-if="showEditMuted && mutedConnections.length !== 0"
				:connections="mutedConnections"
				:margin="true"
				type="muted-selection"
				@select="selectMuted"
			/>
			<div v-else-if="showMuted" class="empty-text">No muted users.</div>
			<div v-if="isAdmin">
				<button v-if="!showEditMuted" class="edit-button" @click="editMuted">Manage muted</button>
				<button v-if="showEditMuted" class="edit-button" @click="showEditMuted = false">Done!</button>
				<ListUsers
					v-if="showEditMuted && usersInChannel.length !== 0"
					:connections="usersFilter((connection) => connection.role < ChannelRole.ADMIN)"
					:margin="true"
					type="muted-selection"
					@select="selectMuted"
				/>
			</div>

		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { chatStore } from "@/store";
import { ChanConnection, ChannelRole } from "@/models/ChanConnection";

type Filter = (connection: ChanConnection) => boolean;

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
			get ChannelRole() {
				return ChannelRole;
			},
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
				return this.mutedList;
			},
			get usersInChannel() {
				return chatStore.chanConnections;
			},
			get isOwner(): boolean {
				return chatStore.roleOnCurrentChannel === ChannelRole.OWNER;
			},
			get isAdmin(): boolean {
				return chatStore.roleOnCurrentChannel >= ChannelRole.ADMIN;
			},
			selectedAdmins: [] as ChanConnection[],
			selectedBanned: [] as ChanConnection[],
			mutedList: [] as ChanConnection[],
			showChanProps: true,
			showAdmin: true,
			showEditAdmin: false,
			showBanned: true,
			showEditBanned: false,
			showMuted: true,
			showEditMuted: false,
		};
	},
	mounted() {
		this.$nuxt.$on("mute", (sec: number) => {
		});
		setInterval(() => {
			this.mutedList = chatStore.chanConnections.filter((connection) => {
				if (connection.mute_end !== null) {
					return new Date(connection.mute_end).getTime() > Date.now();
				}
				return false;
			});
		}, 1000);
		this.selectedAdmins = [];
		this.selectedBanned = [];
		this.selectedMuted = [];
		for (const connection of this.adminConnections) {
			this.selectedAdmins.push(connection);
		}
		for (const connection of this.bannedConnections) {
			this.bannedConnections.push(connection);
		}
	},
	methods: {
		usersFilter(filter: Filter) {
			return this.usersInChannel.filter(filter);
		},
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
		async saveEditAdmin() {
			for (const connection of this.adminConnections) {
				if (!this.selectedAdmins.includes(connection))
					await this.chat.chanConnection.updateChanConnection({ id: connection.id, role: ChannelRole.USER });
			}
			for (const connection of this.selectedAdmins) {
				if (connection.role < ChannelRole.ADMIN)
					await this.chat.chanConnection.updateChanConnection({ id: connection.id, role: ChannelRole.ADMIN });
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
		async saveEditBanned() {
			for (const connection of this.bannedConnections) {
				if (!this.selectedBanned.includes(connection)) {
					await this.chat.chanConnection.updateChanConnection({ id: connection.id, role: ChannelRole.USER });
				}
			}
			for (const connection of this.selectedBanned) {
				if (connection.role < ChannelRole.OWNER)
					await this.chat.chanConnection.updateChanConnection({
						id: connection.id,
						role: ChannelRole.BANNED,
					});
			}
			this.selectedBanned = [];
			this.showEditBanned = false;
		},
		selectBanned(connections: ChanConnection[]) {
			this.selectedBanned = connections;
		},
		editMuted() {
			this.showEditMuted = true;
		},
		selectMuted(connection: ChanConnection) {
			chatStore.updateMutePopup(connection);
			this.$modal.show("mute_pannel");
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
