<template>
	<client-only>
		<div class="w-full h-full flex flex-col">
			<!-- ChatHeader -->
			<div class="chat-header flex flex-row h-fit">
				<!-- button to hide / show left panel -->
				<button
					v-if="isOnChannel"
					id="show-list-btn"
					class="text-white font-bold rounded"
					@click="onShowChannels"
				>
					<i class="fas fa-plus">#</i>
				</button>

				<!-- Chat title -->
				<h1 id="chat-title" class="w-full text-center mt-auto mb-auto">Chat</h1>

				<!-- button to hide / show right panel -->
				<button v-if="isOnChannel" id="show-list-btn" class="text-white font-bold rounded" @click="onShowUsers">
					<UserLogo />
				</button>
			</div>

			<!-- Chat container -->
			<div id="chat-container" class="flex flex-row justify-between items-center overflow-y-hidden">
				<LeftPanel v-if="showChannels" />
				<Chatbox v-if="isOnChannel" />
				<RightPanel v-if="showUsers && isOnChannel" />
			</div>

			<!-- loads all the chat popup -->
			<Popup name="user_profile">
				<UserProfile />
			</Popup>
			<Popup name="create_channel">
				<ChannelCreation />
			</Popup>
			<Popup name="edit_channel">
				<ChannelEdition />
			</Popup>
			<Popup name="join_protected_chan">
				<JoinProtectedChan />
			</Popup>
			<Popup name="mute_pannel">
				<MutePanel />
			</Popup>
		</div>
	</client-only>
</template>

<script lang="ts">
import Vue from "vue";
import { Channel } from "@/models/Channel";
import { Message } from "@/models/Message";
import { store } from "@/store";
import { ChanConnection, ChannelRole } from "@/models/ChanConnection";
import { initialiseStores } from "@/utils/store-accessor";
import { Relation, RelationType } from "@/models/Relation";
import { ChanInvitation } from "@/models/ChanInvitation";

export default Vue.extend({
	name: "Chat",
	middleware: ["getUser"],
	data() {
		return {
			// variable to show / hide left panel
			// hide by default if on mobile and on a channel, else show it
			showChannels: !this.$device.isMobile || !store.channel.currentConnection.channel?.name,

			// variable to show / hide right panel
			// hide by default if on mobile
			showUsers: !this.$device.isMobile,

			// get the current Channel
			get currentChannel(): Channel {
				return store.channel.currentConnection.channel;
			},

			// check if the user is on a channel
			get isOnChannel() {
				return this.currentChannel?.name;
			},
		};
	},
	created() {
		// ensure to instance the store with the current context
		initialiseStores(this.$store);
	},
	mounted() {
		// if load the chat page and the user already on a channel
		if (this.isOnChannel) {
			// simply tell the server we are back on the channel
			this.$chatSocket.emit("chat:JoinChannel", this.currentChannel.id);
		}
		// and if the socket is already connected when loading the page chat,
		// then simply update the channels list
		if (this.$chatSocket.getSocket().connected) {
			this.updateChannels();
		}

		/*
		 *  Event listeners
		 */
		this.$chatSocket.on("connect", () => {
			this.updateChannels();
		});
		this.$chatSocket.on("chat:newConnection", (connection: ChanConnection) => {
			store.connection.retrieveConnection(connection.id);
		});
		this.$chatSocket.on("chat:newDm", (connection: ChanConnection) => {
			store.user.pushConnections([connection]);
		});
		this.$chatSocket.on("chat:removeConnection", (connection: ChanConnection) => {
			store.connection.removeChanConnection(connection);
		});
		this.$chatSocket.on("chat:updateConnection", (connection: ChanConnection) => {
			store.connection.pushChanConnection([connection]);
			// if the updated connection is mine and is a connection to the current channel
			if (store.user.me.id === connection.user.id) {
				if (this.isOnChannel && connection.channel.id === this.currentChannel.id) {
					// update the current role on the channel
					store.channel.setCurrentRole(connection.role);

					// if the role is "BANNED"
					if (connection.role === ChannelRole.BANNED)
						// reset the currentConnection
						store.channel.setCurrentConnection(new ChanConnection());
				}
				store.user.pushConnections([connection]);
				// emit an alert to the user if the user is banned
				if (connection.role === ChannelRole.BANNED)
					this.$nuxt.$emit("addAlert", {
						title: "Banned",
						message: `You have been banned from the channel ${connection.channel.name}`,
					});
			}
			this.$nuxt.$emit("updateConnection", connection);
		});
		this.$chatSocket.on("chat:newInvitation", (id: number) => {
			store.invitation.retrieveInvitation(id);
		});
		this.$chatSocket.on("chat:removeInvitation", (invitation: ChanInvitation) => {
			store.invitation.removeInvitation(invitation);
		});
		this.$chatSocket.on("chat:newChannel", (chan: Channel) => {
			store.channel.pushChannel(chan);
		});
		this.$chatSocket.on("chat:updateChannel", (chan: Channel) => {
			store.channel.pushChannel(chan);
		});
		this.$chatSocket.on("chat:removeChannel", (chan: Channel) => {
			store.channel.removeChannel(chan);
			store.user.removeConnectionByChannel(chan);
		});
		this.$chatSocket.on("chat:newMessage", (message: Message) => {
			if (!store.relation.relations.find((r) => r.target.id === message.user && r.type === RelationType.BLOCK))
				store.message.retrieveMessage(message.id);
		});
		this.$chatSocket.on("chat:JoinChannel", (id: number) => this.$nuxt.$emit("JoinedChannel", id));
		this.$chatSocket.on("chat:addRelation", (rel: Relation) => {
			store.relation.pushRelation(rel);
			if (rel.type === RelationType.BLOCK && this.isOnChannel) {
				store.message.setMessages([]);
				store.message.retrieveMessages(this.currentChannel.id);
				this.$nuxt.$emit("refresh-observer", "messages");
			}
		});
		this.$chatSocket.on("chat:updateRelation", (rel: Relation) => {
			store.relation.retrieveRelation(rel.id);
		});
		this.$chatSocket.on("chat:removeRelation", (rel: Relation) => {
			store.relation.removeRelation(rel);
			if (rel.type === RelationType.BLOCK && this.isOnChannel) {
				store.message.setMessages([]);
				store.message.retrieveMessages(this.currentChannel.id);
				this.$nuxt.$emit("refresh-observer", "messages");
			}
		});
	},
	destroyed() {
		// clear all listeners relative to chat when leaving this page
		this.$chatSocket.clearMatchingEvents("chat");
	},
	methods: {
		updateChannels() {
			if (store.user.me.id !== undefined) {
				store.channel.retrieveChannels();
				store.connection.retrieveMyConnections();
				store.relation.retrieveRelations();
			}
		},
		onShowChannels() {
			if (this.$device.isMobile) this.showUsers = false;
			if (this.isOnChannel) this.showChannels = !this.showChannels;
		},
		onShowUsers() {
			if (this.$device.isMobile) this.showChannels = false;
			this.showUsers = !this.showUsers;
		},
	},
});
</script>

<style>
body {
	background-color: bg-design_gray;
	@apply bg-design_dgray;
}

#chat-title {
	vertical-align: middle;
	display: table-cell;
	color: #d5d5d5;
}

.chat-header {
	background-color: #212121;
	@apply p-2;
}

#chat-container {
	background-color: #1b1b1b;
	width: 100%;
	height: 100%;
	min-width: 300px;
	margin-left: auto;
	margin-right: auto;
}

#show-list-btn {
	font: 1.5rem/1.5rem Roboto, sans-serif;
	width: 35px;
	height: 35px;
	cursor: pointer;
	padding: 5px;
}
</style>
