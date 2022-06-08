<template>
	<div id="chat-selection" class="w-1/4 h-full flex flex-col">
		<div v-for="(chan, index) of channels" :key="index">le chan[{{ index }}] est = {{ chan.name }}</div>
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
	},
});
</script>
