<template>
	<div>
		<div v-for="(chan, index) of channels" :key="index">
			<div
				v-if="listType !== 'invitation'"
				class="flex gap-3 items-center chan-name"
				:class="chan.id == currentChannel.id ? 'selected' : ''"
			>
				<button class="cut-text btn text-left" @click="joinChannel(chan)">
					<div class="flex">
						<div v-if="chan.type === ChannelType.PUBLIC" class="w-5">#</div>
						<div v-if="chan.type === ChannelType.PASSWORD" class="w-5 h-5">
							<svg version="1.1" viewBox="0 0 1000 1000" height="30px">
								<g transform="translate(0.000000,600.000000) scale(0.100000,-0.100000)" fill="#a2a2a2">
									<path
										d="M2370 5105 c-606 -84 -1085 -553 -1185 -1161 -10 -60 -15 -166 -15 -325 0 -207 2 -238 16 -243 9 -3 89 -6 179 -6 147 0 165 2 174 18 5 9 11 127 13 262 4 210 8 256 26 322 52 191 128 323 262 459 166 167 339 258 563 294 199 32 374 9 572 -77 221 -96 430 -312 521 -537 59 -145 67 -198 72 -461 2 -135 8 -253 13 -262 9 -16 27 -18 174 -18 90 0 170 3 179 6 14 5 16 36 16 243 0 159 -5 265 -15 325 -64 392 -282 727 -615 947 -275 182 -619 260 -950 214z"
									/>
									<path
										d="M1023 3160 c-12 -5 -27 -18 -33 -29 -8 -15 -10 -271 -7 -894 3 -864 3 -873 26 -972 127 -562 514 -1000 1041 -1178 334 -113 686 -113 1020 0 527 178 914 616 1041 1178 23 99 23 108 26 976 4 856 3 876 -16 900 l-19 24 -1529 2 c-868 1 -1537 -2 -1550 -7z m1672 -1307 c51 -27 107 -85 137 -143 18 -36 23 -60 23 -125 0 -96 -21 -144 -96 -215 l-49 -47 0 -263 c0 -251 -1 -264 -22 -301 -23 -41 -84 -79 -128 -79 -44 0 -105 38 -128 79 -21 37 -22 50 -22 301 l0 263 -49 47 c-75 71 -96 119 -96 215 0 65 5 89 23 125 41 78 107 137 182 161 46 15 182 4 225 -18z"
									/>
								</g>
							</svg>
						</div>
						<div v-if="chan.type === ChannelType.PRIVATE" class="w-4 pt-0.5 mr-1">
							<svg version="1.1" viewBox="0 0 1000 1000">
								<g transform="translate(0.000000,0.000000)" fill="#a2a2a2">
									<path
										d="M500,10C229.4,10,10,229.4,10,500c0,270.6,219.4,490,490,490c270.6,0,490-219.4,490-490C990,229.4,770.6,10,500,10z M675.7,705h-0.4l-502.4,0c-10.1-0.2-18.2-8.2-17.9-17.8c2.7-110.3,81.5-203.9,187.7-236.4c-42.9-25.7-71.4-70.8-71.4-122.4c0-80,68.5-144.8,153-144.8c84.5,0,153,64.8,153,144.8c0,51.5-28.5,96.7-71.4,122.4c106.3,32.5,185,126.1,187.7,236.4C693.9,696.9,685.8,705,675.7,705z M832,702.9H727.7c1.7-5.3,2.8-10.8,2.7-16.5c-2.5-103.5-63.9-196.5-157.8-245.9c26.6-31.3,41.5-70.5,41.5-112c0-17.5-2.8-34.4-7.8-50.5c6.5-1,13.2-1.7,20-1.7c69.2,0,125.2,53.1,125.2,118.5c0,42.2-23.4,79.1-58.4,100.1c86.9,26.6,151.4,103.2,153.6,193.4C846.9,696.2,840.3,702.9,832,702.9z"
									/>
								</g>
							</svg>
						</div>
						<div class="w-full">
							<b>{{ chan.name }}</b>
						</div>
					</div>
				</button>
				<button
					v-if="listType === 'own' && chan.type !== ChannelType.DM"
					class="w-4 h-3"
					@click.prevent="leaveChannel(chan.id)"
				>
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
			<div v-for="(_chan, _index) of channels" v-else :key="_index">
				<div class="cut-text btn text-left">
					<div class="w-full">
						<b>{{ chan.name }}</b>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Channel, ChannelType } from "@/models/Channel";
import { store } from "@/store/";

export default Vue.extend({
	name: "ListChannels",
	props: {
		channels: {
			type: Array,
			default: () => [],
		},
		listType: {
			type: String,
			default: "own",
		},
	},
	data() {
		return {
			get ChannelType() {
				return ChannelType;
			},
			get chanConnections() {
				return store.chat.chanConnections;
			},
			get myChannels() {
				return store.chat.myChannels;
			},
			get currentChannel() {
				return store.chat.currentChannel;
			},
		};
	},
	methods: {
		checkPrivateChannel(chanId: number) {
			return this.myChannels.filter((chan) => chan.id === chanId).length > 0;
		},
		joinChannel(chan: Channel) {
			if (chan.type === ChannelType.PASSWORD) {
				if (this.checkPrivateChannel(chan.id)) this.chat.channel.joinChannel(chan);
				else {
					store.chat.updateJoiningChannel(chan);
					this.$modal.show("join_protected_chan");
				}
			} else {
				this.chat.channel.joinChannel(chan);
			}
		},
		leaveChannel(chanId: number) {
			this.api.post("/channels/" + chanId + "/leave", undefined, undefined, () => {
				if (chanId === store.chat.currentChannel.id) {
					store.chat.resetCurrentChannel();
				}
				store.chat.leaveChannel(chanId);
			});
		},
	},
});
</script>
