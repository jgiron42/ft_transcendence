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
							maxlength="10"
							minlength="2"
							class="message-txt bg-transparent border-none outline-none resize-none flex-auto"
							placeholder="Enter channel name..."
						/>
					</div>
				</div>

				<!-- displays select menu, to select type of channel -->
				<select id="type-select" class="text-black p-2" @change="selectCategory($event)">
					<option value="PUBLIC">public</option>
					<option value="PRIVATE">private</option>
					<option value="PASSWORD">protected</option>
				</select>

				<!-- if channel type is PASSWORD, then displays input area to prompt for a password -->
				<div v-if="selectedType === ChannelType.PASSWORD">
					<div class="flex flex-col">
						<p class="ml-2">Enter the password:</p>
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

				<!-- displays a button to validate the channel creation -->
				<button class="validate" @click.prevent="createChannel">Create the channel {{ channel.name }}</button>
			</div>
		</div>
	</client-only>
</template>

<script lang="ts">
import Vue from "vue";
import { Channel, ChannelType } from "@/models/Channel";
import { store } from "@/store";

export default Vue.extend({
	name: "ChannelCreation",
	data() {
		return {
			// get the ChannelType enum in order to use it in template
			get ChannelType(): typeof ChannelType {
				return ChannelType;
			},

			// the channel to create
			channel: { name: "", type: ChannelType.PUBLIC } as Channel,

			// the type of channel selected by the user
			selectedType: ChannelType.PUBLIC,
		};
	},
	methods: {
		// method to select the type of channel to create
		selectCategory(event: Event) {
			// get the selected value, casting ChannelType as any in order to use index's syntax on enum
			this.selectedType = (ChannelType as any)[(event.target as HTMLInputElement).value];

			// set the type of the channel to the selected value
			this.channel.type = this.selectedType;

			// if the channel type isn't 'PASSWORD', then reset the password of channel
			if (this.selectedType !== ChannelType.PASSWORD) this.channel.password = "";
		},

		// method to create the channel
		async createChannel() {
			// call to api
			await this.$nuxt.$axios
				.post("/channels", this.channel)
				.then((response) => {
					// ensure the channel is valid in order to join it.
					if (response.data.id) {
						// try to join the channel
						store.channel.joinChannel(response.data);

						// close the popup
						this.$modal.hide("create_channel");
					}
				})
				// if catch some error, add an alert
				.catch(() => {
					window.$nuxt.$emit("addAlert", { title: "Error:", message: "Failed to create the channel" });
				});
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
</style>
