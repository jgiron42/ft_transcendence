<template>
		<div class="v-full h-full">
			<div class="text-white flex flex-col pl-8 pr-8">
				<div class="flex flex-row">
					<p>Channel name</p>
					<div class="area-chan-name p-2">
						<input
							id="textarea-chan-name"
							v-model="chan_name"
							maxlength="20"
							class="message-txt bg-transparent border-none outline-none resize-none flex-auto"
							placeholder="Enter channel name..."
						/>
					</div>
				</div>
				<div>
					<br />
				</div>
				<select id="type-select" class="text-black p-2" name="pets" @change="selectCategory($event)">
					<option value="0">--Please choose an option--</option>
					<option value="1">public</option>
					<option value="2">private</option>
					<option value="3">with password</option>
				</select>
				<div>
					<br />
				</div>
				<div v-if="chan_type === '3'">
					<div class="flex flex-row">
						<p>Enter the password</p>
						<div class="area-chan-name p-2">
							<input
								id="textarea-password"
								v-model="chan_password"
								type="password"
								maxlength="20"
								class="message-txt bg-transparent border-none outline-none resize-none flex-auto"
								placeholder="Password..."
							/>
						</div>
					</div>
				</div>
				<div>
					<br />
				</div>
				<button class="validate">Create the channel {{ chan_name }}</button>
			</div>
		</div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
	name: "ChannelCreation",
	data() {
		return {
			chan_name: "",
			chan_type: "0",
			chan_password: "",
		};
	},
	mounted() {
		this.chan_type = "0";
	},
	methods: {
		selectCategory(event: Event) {
			this.chan_type = (event.target as HTMLInputElement).value;
		},
	},
});
</script>

<style>
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
