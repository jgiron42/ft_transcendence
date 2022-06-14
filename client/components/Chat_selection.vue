<template>
	<div id="chat-selection" class="w-1/4 h-full p-4">
		<button class="chan-text items-center cut-text w-95 btn pr-3 pl-3" @click="$modal.show('create_channel')">
			Create a channel
		</button>
		<Popup component="ChannelCreation"/>
		<div v-for="(chan, index) of channels" :key="index">
			<button class="chan-name cut-text btn pr-3 pl-3" @click="JC(chan.name)">
				{{ chan.name }}
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
	},
	methods: {
		JC(chan: string) {
			this.socket.emit("JC", chan);
		},
		getChannels() {
			this.socket.emit("GC");
		},
		onGC(chans: Channel[]) {
			this.channels = chans;
		},
	},
});
</script>

<style>
#chat-selection {
	overflow: auto;
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
	color: black;
	font: 1em "Open Sans", sans-serif;
	width: 100%;
	padding: 10px;
	border-radius: 10px;
	margin-bottom: 5px;
	text-align: center;
	background-color: #cecece;
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
</style>
