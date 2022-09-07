<template>
	<client-only>
		<div class="v-full h-full">
			<div class="text-white flex flex-col pl-8 pr-8 gap-4">
				<!-- displays input area for channel name -->
				<div class="flex flex-col">
					<p class="ml-2">Channel name:</p>
					<div class="area-chan-name p-2">
						<input
							id="textarea-chan-name"
							v-model="channel.name"
							:maxlength="maxLength"
							:minlength="minLength"
							class="message-txt bg-transparent border-none outline-none resize-none flex-auto"
							placeholder="Enter channel name..."
						/>
					</div>
				</div>

				<!-- displays select menu, to select type of channel -->
				<select
					id="type-select"
					v-model="selectedTypeName"
					class="text-black p-2"
					@change="selectCategory($event)"
				>
					<option value="PUBLIC">public</option>
					<option value="PRIVATE">private</option>
					<option value="PASSWORD">protected</option>
				</select>

				<!-- if channel type is PASSWORD, then displays input area to prompt for a password -->
				<div v-if="selectedType === ChannelType.PASSWORD">
					<div class="flex flex-col">
						<p class="ml-2">Enter the password:</p>
						<p class="info ml-2">(Leaving this field empty will not update the password)</p>
						<div class="area-chan-name p-2">
							<input
								id="textarea-password"
								v-model="channel.password"
								type="password"
								maxlength="20"
								class="message-txt bg-transparent border-none outline-none resize-none flex-auto"
								placeholder="Password..."
							/>
						</div>
					</div>
				</div>

				<!-- displays a button to validate the channel edition -->
				<button class="validate" @click.prevent="updateChannel">
					Update the channel {{ currentChannel.name }}
				</button>
			</div>
		</div>
	</client-only>
</template>

<script lang="ts">
import Vue from "vue";
import { Channel, ChannelType } from "@/models/Channel";
import { store } from "@/store";
import { config } from "@/config/config";

export default Vue.extend({
	name: "ChannelCreation",
	data: () => ({
		// Initialize the channel based on the current channel
		channel: {
			id: store.channel.currentConnection.channel.id,
			name: store.channel.currentConnection.channel.name,
			type: store.channel.currentConnection.channel.type,
			password: "",
		} as Channel,

		// Initialize the selected type to the current channel type
		selectedType: store.channel.currentConnection.channel.type,

		minLength: config.channelNameMinLength,
		maxLength: Math.max(
			config.usernameMaxLength * 2 + 3, // minimum length for dm channels
			config.usernameMaxLength,
		),

		// selectedTypeName is used for mappiong the selected type to a value understandable by the select element
		get selectedTypeName(): string {
			switch (this.selectedType) {
				case ChannelType.PUBLIC:
					return "PUBLIC";
				case ChannelType.PRIVATE:
					return "PRIVATE";
				case ChannelType.PASSWORD:
					return "PASSWORD";
				default:
					return "PUBLIC";
			}
		},

		// getter to get the current channel
		get currentChannel(): Channel {
			return store.channel.currentConnection.channel;
		},

		// get the ChannelType enum in order to use it in template
		get ChannelType(): typeof ChannelType {
			return ChannelType;
		},
	}),
	methods: {
		// selectCategory is the callback for the select element
		selectCategory(event: Event) {
			// Get the selected value
			// - cast ChannelType as any to be able to access to the enum with index
			this.selectedType = (ChannelType as any)[(event.target as HTMLInputElement).value];

			// set the channel type to the selectedType
			this.channel.type = this.selectedType;

			// if the channel is not a password channel, remove the password
			if (this.selectedType !== ChannelType.PASSWORD) this.channel.password = "";
		},

		// updateChannel is the callback for the update button
		async updateChannel() {
			// call api to update the channel with new properties
			await store.channel.updateChannel(this.channel);

			// close the popup
			this.$modal.hide("edit_channel");
		},
	},
});
</script>

<style scoped>
.area-chan-name {
	border: none;
	border-bottom: 1px solid #333;
	background-color: #1c2638;
	border-radius: 7px;
	outline: none;
	width: 80%;
	padding-top: 12px;
	resize: none;
	font: 1em "Open Sans", sans-serif;
	display: inline;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}

.validate {
	overflow: hidden;
	color: black;
	font: 1em "Open Sans", sans-serif;
	width: 100%;
	padding: 10px;
	border-radius: 10px;
	margin-bottom: 5px;
	text-align: center;
	background-color: #cecece;
	display: inline;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.info {
	font: 0.75em "Open Sans", sans-serif;
	color: #d0d0d0;
	padding-bottom: 5px;
}
</style>
