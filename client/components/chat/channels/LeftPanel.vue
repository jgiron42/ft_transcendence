<template>
	<div id="chat-selection" class="h-full" :class="isOnChannel ? 'on-channel' : ''">
		<div class="flex flex-col h-full">
			<div class="flex">
				<div class="pl-11 chat-title">Channels</div>
				<button
					id="channel-creation"
					class="items-center cut-text w-95 btn pr-3 pl-3"
					@click="$modal.show('create_channel')"
				>
					+
				</button>
			</div>
			<div class="flex flex-col">
				<div class="flex p-2">
					<button
						class="btn-group btn-left"
						:class="selection === 0 ? 'btn-selected' : ''"
						@click.prevent="selection = 0"
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
			</div>
			<div class="h-full overflow-auto p-2">
				<ArrowDropdown
					v-if="selection === 0"
					name="invitations"
					:click="onShowInvitations"
					:state="showInvitations"
				/>
				<ListChanInvitations
					v-if="selection === 0 && showInvitations && invitations.length !== 0"
					:invitations="invitations"
				/>
				<div v-else-if="selection === 0 && showInvitations" class="empty-text">No invitations.</div>
				<ListChannels v-if="selection === 0" :channels="myChannels" list-type="own" />
				<ListChannels v-if="selection === 1" :channels="visibleChannels" list-type="all" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { store } from "@/store";
import { ChannelType } from "@/models/Channel";

export default Vue.extend({
	name: "LeftPanel",
	props: {
		align: {
			type: String,
			default: "left",
		},
	},
	data() {
		return {
			get visibleChannels() {
				return store.chat.visibleChannels.filter((channel) => channel.type !== ChannelType.DM);
			},
			get myChannels() {
				return store.chat.myChannels;
			},
			get invitations() {
				return store.invitation.chanInvitations.filter((invitation) => {
					return !store.chat.chanConnections.some((connection) => {
						return connection.channel.id === invitation.channel.id;
					});
				});
			},
			get isOnChannel() {
				return store.chat.currentChannel.name;
			},
			selection: 0,
			showInvitations: true,
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
		store.invitation.retrieveInvitations();
	},
	methods: {
		onShowInvitations() {
			this.showInvitations = !this.showInvitations;
		},
	},
});
</script>

<style>
#chat-selection {
	overflow: auto;
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
