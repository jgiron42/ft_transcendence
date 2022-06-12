<template xmlns="http://www.w3.org/1999/html">
	<div id="chat-selection" class="w-1/4 h-full flex flex-col">
		<button class="chan-text" @click="onNewChannel()">
			<div class="items-center cut-text w-95">Create a new channel</div>
		</button>
		<div id="myPopup" class="newChanPopup" :class="showPopup ? 'showPopup' : ''">
			<div class="w-full h-full min-w-0 p-2">
				<div class="titlePopup">
					<h1>Chan creation</h1>
				</div>
				<div class="nobr">
					<div class="titlePopup">Chan name:</div>
					<input type="text" placeholder="Nom du channel" />
				</div>
				<!--				<textarea-->
				<!--					id="textarea"-->
				<!--					v-model="text"-->
				<!--					maxlength="1000"-->
				<!--					class="message-txt bg-transparent border-none outline-none resize-none w-full flex-auto"-->
				<!--					placeholder="Enter message..."-->
				<!--					@keydown.enter.prevent="sendMessage"-->
				<!--				/>-->
			</div>
			<button class="close-button items-center cut-text w-95" @click="closePopup()">
				<div class="items-center cut-text w-95">close</div>
			</button>
		</div>
		<!--div class="modal" id="modale"> lol </ div-->
		<div v-for="(chan, index) of channels" :key="index">{{ chan.name }}</div>
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
		this.socket.on("joinRealm", () => {
			this.getChannels();
		});
		this.socket.on("getChannels", (chans: Channel[]) => {
			this.fillChannels(chans);
		});
	},
	methods: {
		getChannels() {
			this.socket.emit("getChannels");
		},
		fillChannels(chans: Channel[]) {
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
