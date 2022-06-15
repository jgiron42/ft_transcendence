<template>
	<div id="container-test" class="flex flex-row justify-between items-center overflow-y-hidden">
		<chat-selection :socket="socket" />
    <Chatbox :socket="socket" />
		<Popup name="create_channel" component="ChannelCreation" />
	</div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
	name: "Chat",
	data() {
		return {
			socket: this.$nuxtSocket({
				name: "chat",
				channel: "/chat",
				reconnection: true,
				reconnectionAttempts: Infinity,
				reconnectionDelay: 1000,
				reconnectionDelayMax: 5000,
				timeout: 10000,
				autoConnect: true,
				transports: ["websocket"],
				teardown: false,
				forceNew: false,
			}),
		};
	},
});
</script>

<style>
body {
	@apply bg-design_dgray;
}

#container-test {
	width: 100%;
	height: 100%;
	min-width: 300px;
	margin-left: auto;
	margin-right: auto;
}
</style>
