<template>
	<div class="v-full h-full">
		<div class="text-white flex flex-col pl-8 pr-8 gap-4">
			mute:
			<div class="flex">
				<input
					type="number"
					oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');"
					v-model="value"
					@keydown.enter.prevent="validateInput"
				/>
				<select
					id="type-select"
					v-model="selected"
					class="text-black p-2"
					name="pets"
					@change="selectCategory($event)"
				>
					<option value="0">seconds</option>
					<option value="1">minutes</option>
					<option value="2">hours</option>
					<option value="3">day</option>
				</select>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { store } from "@/store";

export default Vue.extend({
	name: "MutePanel",
	data() {
		return {
			selected: "0",
			value: 0,
			get connection() {
				return store.chat.mutePopup;
			},
		};
	},
	methods: {
		selectCategory(event: Event) {
			this.selected = (event.target as HTMLInputElement).value;
		},
		async validateInput() {
			let seconds = 0;
			switch (this.selected) {
				case "0":
					seconds = this.value;
					break;
				case "1":
					seconds = this.value * 60;
					break;
				case "2":
					seconds = this.value * 60 * 60;
					break;
				case "3":
					seconds = this.value * 60 * 60 * 24;
					break;
				default:
					return;
			}
			if (
				await this.chat.chanConnection.updateChanConnection({
					id: this.connection.id,
					mute_end: new Date(Date.now() + seconds * 1000),
				})
			)
				this.$modal.hide("mute_pannel");
		},
	},
});
</script>

<style scoped>
input {
	color: black;
	text-align: right;
	padding-right: 10px;
}
</style>
