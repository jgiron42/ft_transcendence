<template>
	<div v-if="selection == 0" id="user-selection" class="h-full flex flex-col gap-2">
		<div id="title">
			<hr />
			<div id="chan-name" class="panel-title">
				Channel:
				<div class="w-full truncate">
					{{ currentChannel.name }}
				</div>
			</div>
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
import { store } from "@/store";
import { Channel } from "@/models/Channel";
import { ChanConnection, ChannelRole } from "@/models/ChanConnection";

export default Vue.extend({
	name: "UsersInChannel",
	props: {
		/*
		 * selection is used to determine if the users panel is shown or not.
		 * 0 = Users panel, 1 = Admin panel, 2 = Social panel.
		 */
		selection: {
			type: Number,
			default: 0,
		},
	},
	data: () => ({
		showUsers: true,
		get chanConnections(): ChanConnection[] {
			return (
				store.connection.chanConnectionTracker &&
				Array.from(store.connection.chanConnections.values()).filter(
					(connection) => connection.role !== ChannelRole.BANNED,
				)
			);
		},
		get currentChannel(): Channel {
			return store.channel.currentConnection.channel;
		},
	}),
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
