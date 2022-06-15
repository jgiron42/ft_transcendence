<template>
	<div id="chat-selection" class="h-full">
		<button class="chan-text items-center cut-text w-95 btn pr-3 pl-3" @click="$modal.show('create_channel')">
			Create a channel
		</button>
		<div v-for="(chan, index) of channels" :key="index">
			<button
				class="chan-name cut-text btn text-left"
				:class="chan.id == currentChannel.id ? 'selected' : ''"
				@click="JC(chan.name)"
			>
				#
				<b>{{ chan.name }}</b>
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Channel } from "@/models/Channel";

export default Vue.extend({
	name: "ChatSelection",
	props: {
		socket: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			channels: [] as Channel[],
			currentChannel: Channel,
		};
	},
	mounted() {
		if (this.socket.connected) {
			this.getChannels();
		}
		this.socket.on("GAI", () => {
			this.getChannels();
		});
		this.socket.on("GC", (chans: Channel[]) => {
			this.onGC(chans);
		});

		this.socket.on("JC", (payload = { chan: Channel }) => {
			this.onJC(payload.chan);
		});
	},
	methods: {
		JC(chan: string) {
			this.socket.emit("JC", chan);
		},
		onJC(chan: Channel) {
			this.currentChannel = chan as Channel;
		},
		getChannels() {
			this.socket.emit("GC");
		},
		onGC(chans: Channel[]) {
			this.channels = chans;
			currentChannel = this.channels[0];
		},
	},
});
</script>

<style>
#chat-selection {
	overflow: auto;
	padding: 0.5rem;
	width: 240px;
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
</style>
