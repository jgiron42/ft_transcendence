<template>
	<div>
		<div v-for="(chan, index) of channels" :key="index">
			<div class="flex gap-3 items-center chan-name" :class="chan.id == currentChannel.id ? 'selected' : ''">
				<button class="cut-text btn text-left" @click="joinChannel(chan)">
					<div class="flex">
						<div class="w-5">#</div>
						<div class="w-full">
							<b>{{ chan.name }}</b>
						</div>
					</div>
				</button>
				<button v-if="chanType === 'own'" class="w-4 h-3" @click.prevent="test(chan.id)">
					<svg version="1.1" viewBox="0 0 1000 1000" height="10px">
						<g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
							<path
								d="M773.1,4971.1c-173.8-55.3-276.5-118.5-397-237c-294.3-294.3-361.5-754.6-162-1108.1c31.6-55.3,689.4-728.9,1762-1803.5L3686.7,109.9L1964.2-1614.6c-1120-1122-1734.3-1750.1-1760-1801.5c-81-162-108.6-302.2-98.8-495.8c7.9-158,19.8-203.5,81-333.8c122.5-254.8,347.7-444.4,616.3-515.5c209.4-57.3,497.8-19.8,681.5,84.9c55.3,29.6,750.6,711.1,1801.5,1762l1714.6,1710.6l1714.6-1710.6c1050.9-1050.9,1746.2-1732.4,1801.5-1762c347.6-199.5,815.8-130.4,1108.1,162c292.4,292.3,361.5,760.5,162,1108.1c-29.6,55.3-711.1,750.6-1762,1803.5L6313.8,109.9l1710.6,1714.6c1050.9,1050.9,1732.3,1746.2,1762,1801.5c104.7,183.7,142.2,472.1,84.9,681.5c-71.1,268.6-260.7,493.8-515.5,616.3c-254.8,120.5-564.9,114.6-829.6-17.8c-51.3-25.7-679.5-640-1801.5-1760L5000.3,1423.5L3287.7,3134.1c-1074.6,1072.6-1748.1,1730.4-1803.5,1762C1280.8,5010.6,988.4,5040.3,773.1,4971.1z"
								fill="#a2a2a2"
							/>
						</g>
					</svg>
				</button>
			</div>
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
		chanType: {
			type: String,
			default: "own",
		},
	},
	methods: {
		test(chanId: number) {
			console.log(chanId);
		},
	},
});
</script>
