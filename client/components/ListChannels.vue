<template>
	<div>
		<div v-for="(chan, index) of channels" :key="index">
			<button
				class="chan-name cut-text btn text-left"
				:class="chan.id == currentChannel.id ? 'selected' : ''"
				@click="joinChannel(chan)"
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
	name: "ListChannels",
	props: {
		channels: {
			type: Array,
			default: () => [],
		},
		currentChannel: {
			type: Object,
			default: new Channel(),
		},
		joinChannel: {
			type: Function,
			default: () => {},
		},
	},
});
</script>
