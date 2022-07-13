<template>
	<div class="w-full h-full flex flex-col">
		<div class="chat-header flex flex-row h-fit">
			<button v-if="isOnChannel" id="show-list-btn" class="text-white font-bold rounded" @click="onShowChannels">
				<i class="fas fa-plus">#</i>
			</button>
			<h1 id="chat-title" class="w-full text-center mt-auto mb-auto">Chat</h1>
			<button v-if="isOnChannel" id="show-list-btn" class="text-white font-bold rounded" @click="onShowUsers">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					version="1.1"
					x="0px"
					y="0px"
					viewBox="0 0 1000 1000"
					xml:space="preserve"
					fill="#fff"
				>
					<path
						d="M499,578.6c-76.6,0-148.6-29.8-202.7-84c-54.3-54.1-84-126.1-84-202.7s29.8-148.6,84-202.7c54.1-54.3,126.1-84,202.7-84s148.6,29.8,202.7,84c54.1,54.3,84,126.1,84,202.7s-29.8,148.6-84,202.7C647.5,548.7,575.6,578.6,499,578.6z M499,75.9c-119,0-215.9,96.9-215.9,215.9S380,507.8,499,507.8c119,0,215.9-96.9,215.9-215.9S618,75.9,499,75.9z"
					/>
					<path
						d="M850,676.6c-45.3-45.4-98-81.1-156.7-106c-17.8-7.5-38.8,0.2-46.7,17.8c-8.2,18.2,0.2,39.4,18.5,47.2c50.5,21.4,95.8,51.9,134.8,91c39,39,69.5,84.5,90.9,135.1c14,33.1,23.6,67.5,28.8,103c2.5,17.4,17.5,30.2,35,30.2l0,0c21.6,0,38.2-19,35.1-40.4c-6.1-41.3-17.3-81.6-33.7-120.4C931.1,775.2,895.4,722.1,850,676.6z"
					/>
					<path
						d="M109.4,861.7c21.4-50.6,51.9-96.1,90.9-135.1c38.9-39,84-69.5,134.3-90.9c18-7.6,26.9-29.1,19-47.1c-7.8-17.7-28.3-25.9-46.3-18.4C248.4,595.2,195.5,631,150,676.6c-45.4,45.5-81.1,98.5-106,157.6c-16.4,38.8-27.6,78.9-33.7,120.4c-3.1,21.4,13.5,40.4,35.1,40.4l0,0c17.5,0,32.4-12.8,35-30.2C85.8,929.3,95.3,894.8,109.4,861.7z"
					/>
				</svg>
			</button>
		</div>
		<div id="container-test" class="flex flex-row justify-between items-center overflow-y-hidden">
			<ChannelSelection v-if="showChannels" :socket="socket" :is-on-channel="isOnChannel" />
			<Chatbox v-if="isOnChannel" :socket="socket" />
			<ChannelProperties v-if="showUsers && isOnChannel" />
			<Popup name="user_profile" component="chat/users/UserProfile" />
			<Popup name="create_channel" component="chat/channels/ChannelCreation" />
			<Popup name="join_protected_chan" component="chat/channels/JoinProtectedChan" />
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Channel } from "@/models/Channel";
import { Message } from "@/models/Message";
import { chatStore } from "@/store";

export default Vue.extend({
	name: "Chat",
	middleware: ["getUser", "auth"],
	data() {
		return {
			socket: this.$socket.getSocket(),
			showChannels: !this.$device.isMobile,
			showUsers: !this.$device.isMobile,
			get currentChannel() {
				return chatStore.currentChannel;
			},
			get isOnChannel() {
				const name = this.currentChannel.name;
				return name !== undefined && name.length !== 0;
			},
		};
	},
	mounted() {
		if (this.currentChannel.id !== undefined) {
			this.socket.emit("JC", this.currentChannel.id);
		}
		if (this.socket.connected) {
			this.updateChannels();
		}
		this.socket.on("connect", () => {
			this.updateChannels();
		});
		this.socket.emit("HC", {
			token: this.$cookies.get("connect.sid"),
		});
		this.socket.on("updateChannels", () => {
			this.updateChannels();
		});
		this.socket.on("updateRelations", () => {
			this.chat.getRelations();
		});
		this.socket.on("updateChanConnections", () => {
			this.updateChannels();
		});
		this.socket.on("updateChanInvitations", () => {
			this.chat.getChanInvitations();
		});
		this.socket.on("MSG", (message: Message) => {
			this.$nuxt.$emit("MSG", message);
		});
		this.socket.on("JC", (messages: Message[]) => {
			this.$nuxt.$emit("JC", messages);
		});

		// Nuxt events
		this.$nuxt.$on("updateChannels", () => {
			this.updateChannels();
		});
		this.$nuxt.$on("createChannel", async (chan: Channel) => {
			const c = await this.chat.joinChannel(chan);
			if (c) this.socket.emit("JC", c.id);
		});
	},
	destroyed() {
		this.socket.removeAllListeners();
	},
	methods: {
		async updateChannels() {
			await this.chat.getMyChannels();
			await this.chat.getVisibleChannels();
			await this.chat.getChanConnections();
			await this.chat.getRelations();
			await this.chat.getChanInvitations();
		},
		onShowChannels() {
			if (this.$device.isMobile) {
				this.showUsers = false;
			}
			if (this.isOnChannel) this.showChannels = !this.showChannels;
		},
		onShowUsers() {
			if (this.$device.isMobile) {
				this.showChannels = false;
			}
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

#container-test {
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
