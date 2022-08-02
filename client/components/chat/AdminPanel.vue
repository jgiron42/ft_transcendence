<template>
	<client-only>
		<div>
			<!-- displays admin panel only if selection === 1 -->
			<div v-if="selection === 1" id="admin-panel" class="h-full flex flex-col gap-2">
				<!-- displays Admin Panel title -->
				<div id="title">
					<hr />
					<div class="panel-title">Admin Panel</div>
					<hr />
				</div>
				<br />

				<!-- displays the channel edition panel -->
				<div id="channel-prop">
					<ArrowDropdown name="channel properties" :click="onShowChanProps" :state="showChanProps" />
					<div v-if="showChanProps" class="">
						<EditChannel />
					</div>
				</div>

				<!-- displays the admin list edition panel -->
				<div id="admin-list">
					<ArrowDropdown name="admins users" :click="onShowAdmin" :state="showAdmin" />
					<!-- if the user is an admin, simply displays the list of admin users -->
					<ListUsers
						v-if="showAdmin && adminConnections.length !== 0"
						:connections="adminConnections"
						:margin="true"
					/>
					<!-- if the user is also the owner, then add the edition panel to manage admin users -->
					<div v-if="isOwner">
						<button v-if="!showEditAdmin" class="edit-button" @click="editAdmin">Manage admins</button>
						<button v-if="showEditAdmin" class="edit-button" @click="saveEditAdmin">Save!</button>
						<ListUsers
							v-if="showEditAdmin"
							:connections="chanConnections"
							:pre-selected="adminConnections"
							:margin="true"
							type="admin-selection"
							@select="selectAdmin"
						/>
					</div>
				</div>
				<hr />

				<!-- displays the ban list edition panel -->
				<div id="ban-list">
					<ArrowDropdown name="banned users" :click="onShowBanned" :state="showBanned" />
					<ListUsers
						v-if="showBanned && bannedConnections.length !== 0"
						:connections="bannedConnections"
						:margin="true"
					/>
					<div v-else-if="showBanned" class="empty-text">No banned users.</div>
					<!-- if the user is admin, add the edition panel to manage banned users -->
					<div v-if="isAdmin">
						<button v-if="!showEditBanned" class="edit-button" @click="editBanned">Manage banned</button>
						<button v-if="showEditBanned" class="edit-button" @click="saveEditBanned">Save!</button>
						<ListUsers
							v-if="showEditBanned && chanConnections.length !== 0"
							:connections="usersFilter((connection) => connection.role < ChannelRole.OWNER)"
							:pre-selected="bannedConnections"
							:margin="true"
							type="banned-selection"
							@select="selectBanned"
						/>
					</div>
					<!-- if the list of user is empty, add text saying 'No users.' -->
					<div
						v-if="
							showEditBanned &&
							usersFilter((connection) => connection.role < ChannelRole.OWNER).length === 0
						"
						class="empty-text"
					>
						No users.
					</div>
				</div>
				<hr />

				<!-- displays the muted list edition panel -->
				<div id="mute-list">
					<ArrowDropdown name="muted users" :click="onShowMuted" :state="showMuted" />
					<ListUsers
						v-if="showMuted && mutedConnections.length !== 0"
						:connections="mutedConnections"
						:margin="true"
						type="muted-selection"
						@select="selectMuted"
					/>
					<div v-else-if="showMuted" class="empty-text">No muted users.</div>
					<!-- is user is admin, displays mute edition panel -->
					<div v-if="isAdmin">
						<button v-if="!showEditMuted" class="edit-button" @click="editMuted">Manage muted</button>
						<button v-if="showEditMuted" class="edit-button" @click="showEditMuted = false">Done!</button>
						<ListUsers
							v-if="showEditMuted && chanConnections.length !== 0"
							:connections="usersFilter((connection) => connection.role < ChannelRole.ADMIN)"
							:margin="true"
							type="muted-selection"
							@select="selectMuted"
						/>
					</div>
				</div>
			</div>
		</div>
	</client-only>
</template>

<script lang="ts">
import Vue from "vue";
import { store } from "@/store";
import { ChanConnection, ChannelRole } from "@/models/ChanConnection";

type Filter = (connection: ChanConnection) => boolean;

export default Vue.extend({
	name: "AdminPanel",
	props: {
		/*
		 * selection is used to determine if the admin panel is shown or not.
		 * 0 = Users panel, 1 = Admin panel, 2 = Social panel.
		 */
		selection: {
			type: Number,
			default: 0,
		},
	},
	data: () => ({
		// retrieve connections of the current channel
		get chanConnections(): ChanConnection[] {
			return store.connection.chanConnectionTracker && Array.from(store.connection.chanConnections.values());
		},
		// get the ChannelRole enum in order to use it in template
		get ChannelRole() {
			return ChannelRole;
		},
		// retrieve connections that have either 'admin' or 'owner' role
		get adminConnections(): ChanConnection[] {
			return this.chanConnections.filter((connection) =>
				[ChannelRole.OWNER, ChannelRole.ADMIN].includes(connection.role),
			);
		},
		// retrieve connections that have the 'banned' role
		get bannedConnections(): ChanConnection[] {
			return this.chanConnections.filter((connection) => connection.role === ChannelRole.BANNED);
		},
		// check if the current user is the owner of the channel
		get isOwner(): boolean {
			return store.channel.currentConnection.role === ChannelRole.OWNER;
		},
		// check if the current user is at least admin of the channel
		get isAdmin(): boolean {
			return store.channel.currentConnection.role >= ChannelRole.ADMIN;
		},

		// selectedAdmins and selectedBanned are used to store the selected users when editing banned or admins users
		selectedAdmins: [] as ChanConnection[],
		selectedBanned: [] as ChanConnection[],
		mutedConnections: [] as ChanConnection[],

		// show / hide the properties of current channel
		showChanProps: true,

		// show / hide the admin list and the admin list edition
		showAdmin: true,
		showEditAdmin: false,

		// show / hide the banned list and the banned list edition
		showBanned: true,
		showEditBanned: false,

		// show / hide the muted list and the muted list edition
		showMuted: true,
		showEditMuted: false,
	}),
	mounted() {
		// check every seconds the muted users in order to display them in the muted list
		setInterval(() => {
			this.mutedConnections = this.chanConnections.filter((connection) => {
				if (connection.mute_end !== null) {
					// construct a new Date to ensure that mute_end is a date object in order to call getTime()
					return new Date(connection.mute_end).getTime() > Date.now();
				}
				return false;
			});
		}, 1000);

		this.selectedAdmins = [...this.adminConnections];
		this.selectedBanned = [...this.bannedConnections];
	},
	methods: {
		// filter the connections based on the given filter function
		usersFilter(filter: Filter): ChanConnection[] {
			return this.chanConnections.filter(filter);
		},

		/* ****************************************************************** */
		/*   Functions used to manage admins                                  */
		/* ****************************************************************** */

		// function called when the user click on the 'Manage admins' button
		editAdmin() {
			this.showEditAdmin = true;
		},
		// function given to the ListUsers component to select admins in users list
		selectAdmin(connections: ChanConnection[]) {
			this.selectedAdmins = connections;
		},
		// function called when the user click on the 'Done!' button
		saveEditAdmin() {
			// for each connection in the admins connection which is not in the selectedAdmins list, remove the admin role
			for (const connection of this.adminConnections) {
				if (!this.selectedAdmins.includes(connection))
					store.connection.updateChanConnection({ id: connection.id, role: ChannelRole.USER });
			}
			// for each connection in the selectedAdmins list which is not in the admin connections, add the admin role
			for (const connection of this.selectedAdmins) {
				if (connection.role < ChannelRole.ADMIN)
					store.connection.updateChanConnection({ id: connection.id, role: ChannelRole.ADMIN });
			}
			// reset the selectedAdmins list and hide the edition panel
			this.selectedAdmins = [...this.adminConnections];
			this.showEditAdmin = false;
		},

		/* ****************************************************************** */
		/*   Functions used to manage banned users                            */
		/* ****************************************************************** */

		// function called when the user click on the 'Manage banned' button
		editBanned() {
			this.showEditBanned = true;
		},
		// function given to the ListUsers component to select banned users in users list
		selectBanned(connections: ChanConnection[]) {
			this.selectedBanned = connections;
		},
		// function called when the user click on the 'Done!' button
		saveEditBanned() {
			// for each connection in the banned connection which is not in the selectedBanned list, remove the banned role
			for (const connection of this.bannedConnections) {
				if (!this.selectedBanned.includes(connection)) {
					store.connection.updateChanConnection({ id: connection.id, role: ChannelRole.USER });
				}
			}
			// for each connection in the selectedBanned list which is not in the banned connections, add the banned role
			for (const connection of this.selectedBanned) {
				if (connection.role < ChannelRole.OWNER)
					store.connection.updateChanConnection({
						id: connection.id,
						role: ChannelRole.BANNED,
					});
			}
			// reset the selectedBanned list and hide the edition panel
			this.selectedBanned = [...this.bannedConnections];
			this.showEditBanned = false;
		},

		/* ****************************************************************** */
		/*   Functions used to manage muted users                             */
		/* ****************************************************************** */

		// function called when the user click on the 'Manage muted' button
		editMuted() {
			this.showEditMuted = true;
		},
		// function given to the ListUsers component to select muted users in users list
		selectMuted(connection: ChanConnection) {
			store.popup.setConnection(connection);
			this.$modal.show("mute_pannel");
		},

		/* ****************************************************************** */
		/* Functions to hide/show the different components of the admin panel */
		/* ****************************************************************** */
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
