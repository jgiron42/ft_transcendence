<template>
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
