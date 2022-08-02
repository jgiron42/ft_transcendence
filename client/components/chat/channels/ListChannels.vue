<template>
	<client-only>
		<div>
			<!-- iterate through list of channels -->
			<div v-for="(chan, index) of channels" :key="index">
				<!-- if channel the channel is the current channel, then add 'selected' class to highlight it -->
				<div class="flex gap-3 items-center chan-name" :class="chan.id == currentChannel.id ? 'selected' : ''">
					<!-- declare button to call joinChannel method when clicked -->
					<button class="cut-text btn text-left" @click="joinChannel(chan)">
						<div class="flex">
							<!-- add a logo depending on type of channel -->
							<!-- if it's a public channel display a # -->
							<div v-if="chan.type === ChannelType.PUBLIC" class="w-5">#</div>

							<!-- if it's a protected channel, display a padlock -->
							<div v-if="chan.type === ChannelType.PASSWORD" class="w-5 h-5">
								<ProtectedLogo />
							</div>

							<!-- if it's a private channel, display "PrivateLogo" -->
							<div v-if="chan.type === ChannelType.PRIVATE" class="w-4 pt-0.5 mr-1">
								<PrivateLogo />
							</div>

							<!-- add the channel name -->
							<div class="w-full">
								<b>{{ chan.name }}</b>
							</div>
						</div>
					</button>

					<!-- if it's a channel in which i am connected and it's not a DM channel, then add a button to leave it -->
					<button
						v-if="listType === 'own' && chan.type !== ChannelType.DM"
						class="w-4 h-3"
						@click.prevent="leaveChannel(chan.id)"
					>
						<CrossLogo />
					</button>
				</div>
			</div>
		</div>
	</client-only>
</template>

<script lang="ts">
import Vue from "vue";
import { Channel, ChannelType } from "@/models/Channel";
import { ChannelRole } from "@/models/ChanConnection";
import { store } from "@/store/";

export default Vue.extend({
	name: "ListChannels",
	props: {
		channels: {
			type: Array,
			default: () => [],
		},
		// type of list to display, if listType === "own":
		// A button to leave channel will be display next to the channel name
		listType: {
			type: String,
			default: "own",
		},
	},
	data: () => ({
		// return ChannelType in order to use it in template
		get ChannelType() {
			return ChannelType;
		},

		// return all channels of the current user
		get myChannels(): Channel[] {
			return (
				store.user.connectionsTracker &&
				Array.from(store.user.connections.values())
					.filter((c) => c.role !== ChannelRole.BANNED)
					.map((c) => c.channel)
			);
		},

		// return the current channel
		get currentChannel(): Channel {
			return store.channel.currentConnection.channel;
		},
	}),
	methods: {
		// function to check if a channel is connected
		checkPrivateChannel(chanId: number) {
			return this.myChannels.find((c) => c.id === chanId) !== undefined;
		},

		// function called when joining a channel
		joinChannel(chan: Channel) {
			// if the channel is protected by a password
			if (chan.type === ChannelType.PASSWORD) {
				// if we already have a connection to the channel then simply join it
				if (this.checkPrivateChannel(chan.id)) store.channel.joinChannel(chan);
				// otherwise, popup the modal "join_protected_chan" in order to ask the password
				else {
					store.popup.setChannel(chan);
					this.$modal.show("join_protected_chan");
				}
			}
			// else, simply join the channel
			else store.channel.joinChannel(chan);
		},

		// function called when leaving a channel
		leaveChannel(chanId: number) {
			store.channel.leaveChannel(chanId);
		},
	},
});
</script>
