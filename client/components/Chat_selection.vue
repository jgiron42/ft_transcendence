<template>
	<div id="chat-selection" class="w-1/4 h-full flex flex-col">
		<div v-for="(chan, index) of channels" :key="index">le chan[{{ index }}] est = {{ chan.name }}</div>
	</div>
</template>
>

<script>
export default {
	name: "ChatSelection",
	props: {
		socket: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			channels: [],
		};
	},

	mounted() {
		this.socket.on("connect", () => {
			this.getChannels();
		});
		this.socket.on("getChannels", (chans) => {
			this.fillChannels(chans);
		});
	},
	methods: {
		getChannels() {
			this.socket.emit("getChannels");
		},
		fillChannels(chans) {
			this.channels = chans;
		},
	},
};
</script>
