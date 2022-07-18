<template>
	<div id="user-pannel" class="h-full w-full">
		<div class="flex flex-col h-full">
			<div class="flex p-2">
				<button
					class="btn-group btn-left"
					:class="selection === 0 ? 'btn-selected' : ''"
					@click.prevent="selection = 0"
				>
					Channel
				</button>
				<button
					v-if="isAdmin"
					class="btn-group"
					:class="selection === 1 ? 'btn-selected' : ''"
					@click.prevent="selection = 1"
				>
					Admin
				</button>
				<button
					class="btn-group btn-right"
					:class="selection === 2 ? 'btn-selected' : ''"
					@click.prevent="selection = 2"
				>
					Social
				</button>
			</div>
			<div class="h-full overflow-auto p-2">
				<UsersInChannel :selection="selection" />
				<AdminPanel :selection="selection" />
				<SocialPanel :selection="selection" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { store } from "@/store";
import { ChanConnection, ChannelRole } from "@/models/ChanConnection";

export default Vue.extend({
	name: "RightPanel",
	data() {
		return {
			socket: this.$socket.getSocket(),
			selection: 0,
			showInvitations: true,
			get me() {
				return store.chat.me;
			},
			get isAdmin(): boolean {
				return store.channel.currentChannel.role >= ChannelRole.ADMIN;
			},
		};
	},
	mounted() {
		this.$nuxt.$on("updateChannels", () => {
			if (this.selection === 1) this.selection = 0;
		});
		this.socket.on("updateConnection", (connection: ChanConnection) => {
			if (
				store.chat.me.id === connection.user.id &&
				connection.role < ChannelRole.ADMIN &&
				this.selection === 1
			) {
				this.selection = 0;
			}
		});
	},
});
</script>

<style>
#user-pannel {
	overflow: auto;
	width: 240px;
	min-width: 240px;
	background-color: #252525;
}

.btn-group {
	color: #95b5df;
	font: 1em "Open Sans", sans-serif;
	width: 100%;
	background-color: #364157;
	align-content: center;
	padding: 10px;
}

.btn-left {
	border-radius: 10px 0 0 10px;
}

.btn-right {
	border-radius: 0 10px 10px 0;
}

.btn-selected {
	background-color: #97add9;
	color: #2c3548;
}

.empty-friends {
	color: #d5d5d5;
}
</style>

<style scoped>
.btn-group {
	font-size: small;
}
</style>
