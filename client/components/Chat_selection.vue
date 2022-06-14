<template xmlns="http://www.w3.org/1999/html">
	<div id="chat-selection" class="w-1/4 h-full flex flex-col">
		<button class="btn pr-3 pl-3" @click="$modal.show('create_channel')">Open modal</button>
	<div v-for="(chan, index) of channels" :key="index">
			<button class="btn pr-3 pl-3" @click="JC(chan.name)">
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
		// onNewChannel: {
		//   type: any,
		//   default: () => {},
		// },
	},
	data() {
		return {
			showPopup: false,
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
		onNewChannel() {
			this.showPopup = true;
		},
		closePopup() {
			this.showPopup = false;
		},
	},
});
</script>

<style>
.chan-text {
	overflow: hidden;
	color: #95b5df;
	font: 1em "Open Sans", sans-serif;
	width: 100%;
	padding: 10px;
	border-radius: 15px;
	margin-bottom: 10px;
	text-align: center;
	background-color: #364157;
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
	height: 1.2em;
	white-space: nowrap;
}

.newChanPopup {
	display: none;
	position: fixed;
	width: 100%;
	border: 3px solid #f1f1f1;
	z-index: 9;
	color: black;
	background-color: black;
}

.showPopup {
	display: block;
}

.titlePopup {
	color: white;
}

.nobr {
	display: inline-block;
	white-space: nowrap;
}
</style>
