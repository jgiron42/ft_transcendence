<template>
	<div id="chat-selection" class="h-full" :class="isOnChannel ? 'on-channel' : ''">
		<div class="flex flex-row">
			<div id="channel-title" class="pl-11 w-full text-center mt-auto mb-auto">Channels</div>
			<button
				id="channel-creation"
				class="items-center cut-text w-95 btn pr-3 pl-3"
				@click="$modal.show('create_channel')"
			>
				+
			</button>
		</div>
		<div class="flex flex-col">
			<div class="flex pb-2">
				<button
					class="btn-group btn-left"
					:class="selection === 0 ? 'btn-selected' : ''"
					@click.prevent="
						selection = 0;
						showInvitations = false;
					"
				>
					mine
				</button>
				<button
					class="btn-group btn-right"
					:class="selection === 1 ? 'btn-selected' : ''"
					@click.prevent="selection = 1"
				>
					list
				</button>
			</div>
			<!--UsersInChannel v-if="selection === 0" :socket="socket" />
			<AdminPanel v-if="selection === 1" /-->
		</div>
		<ArrowDropdown v-if="selection === 0" name="invitations" :click="onShowInvitations" />
		<ListChannels
			v-if="selection === 0 && showInvitations && invitations.length !== 0"
			:channels="invitations"
			list-type="invitation"
		/>
		<div v-else-if="selection === 0 && showInvitations" class="empty-text">No invitations.</div>
		<ListChannels
			v-if="selection === 0"
			:channels="myChannels"
			:current-channel="currentChannel"
			:join-channel="joinChannel"
			list-type="own"
		/>
		<ListChannels
			v-if="selection === 1"
			:channels="visibleChannels"
			:current-channel="currentChannel"
			:join-channel="joinChannel"
			list-type=""
		/>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Channel } from "@/models/Channel";
import { chatStore } from "@/store";

export default Vue.extend({
	name: "ChannelSelection",
	props: {
		socket: {
			type: Object,
			default: () => {},
		},
		align: {
			type: String,
			default: "left",
		},
		isOnChannel: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			get visibleChannels() {
				return chatStore.visibleChannels;
			},
			get myChannels() {
				return chatStore.myChannels;
			},
			get currentChannel() {
				return chatStore.currentChannel;
			},
			get invitations() {
				// TODO: get invitations on chatStore
				return [];
			},
			selection: 0,
			showInvitations: false,
		};
	},
	mounted() {
		const containerTest = document.getElementById("container-test");
		if (containerTest != null) {
			if (this.align === "left") {
				containerTest.scrollLeft = 0;
			} else if (this.align === "right") {
				containerTest.scrollLeft = containerTest.scrollWidth;
			}
		}
		this.$nuxt.$on("updateChannels", () => {
			this.onUpdateChannels();
		});
	},
	destroyed() {
		this.$nuxt.$off("updateChannels");
	},
	methods: {
		async onUpdateChannels() {
			await this.chat.getMyChannels();
			if (this.myChannels.length === 0 && this.visibleChannels.length === 0) {
				this.selection = 1;
			}
			this.chat.getVisibleChannels();
		},
		async joinChannel(chan: Channel) {
			const tmp = await this.chat.joinChannel(chan);
			if (tmp) {
				await Vue.prototype.api.get("/channels/" + chan.id, null, (d = { data: new Channel() }) => {
					chatStore.updateCurrentChannel(d.data);
					this.socket.emit("JC", tmp.id);
				});
			}
		},
		onShowInvitations() {
			this.showInvitations = !this.showInvitations;
		},
	},
});
</script>

<style>
#chat-selection {
	overflow: auto;
	padding: 0.5rem;
	width: 35%;
	min-width: min(500px, 100%);
	margin-left: auto;
	margin-right: auto;
	background-color: #252525;
}

.on-channel {
	margin-left: none !important;
	margin-right: none !important;
	width: 240px !important;
	min-width: 240px !important;
}

.chan-text {
	overflow: hidden;
	color: #95b5df;
	font: 1em "Open Sans", sans-serif;
	width: 100%;
	padding: 10px;
	border-radius: 10px;
	margin-bottom: 10px;
	text-align: center;
	background-color: #364157;
}

.chan-name {
	overflow: hidden;
	color: #bdbdbd;
	font: 1em "Open Sans", sans-serif;
	width: 100%;
	padding: 3px;
	border-radius: 5px;
	margin-bottom: 5px;
}

.chan-name:hover {
	background-color: #393939;
	color: #999;
}

.close-button {
	overflow: hidden;
	color: black;
	font: 1em "Open Sans", sans-serif;
	width: 100%;
	padding: 10px;
	border-radius: 15px;
	margin-bottom: 10px;
	text-align: center;
	background-color: white;
}

.cut-text {
	text-overflow: ellipsis;
	overflow: hidden;
	width: 100%;
	white-space: nowrap;
}

.selected {
	background-color: #424242;
}

#channel-title {
	vertical-align: middle;
	color: #d5d5d5;
}

#channel-creation {
	height: fit-content;
	font-size: 30px;
	font-family: Arial, sans-serif;
	color: white;
	width: 45px;
	flex-shrink: 0;
}

.empty-text {
	color: #d5d5d5;
	padding-left: 28px;
}
</style>
