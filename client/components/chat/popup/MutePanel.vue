<template>
	<client-only>
		<div class="v-full h-full">
			<div class="text-white flex flex-col pl-8 pr-8 gap-4">
				mute:
				<div class="flex">
					<!-- Input field for the muted time -->
					<input
						v-model="value"
						type="number"
						oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');"
						@keydown.enter.prevent="validateInput"
					/>

					<!-- Select Menu for the duration unit (s/m/h/d) -->
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
	</client-only>
</template>

<script lang="ts">
import Vue from "vue";
import { store } from "@/store";

export default Vue.extend({
	name: "MutePanel",
	data() {
		return {
			// the selected units
			selected: "0",

			// the value of the input field
			value: 0,

			// get the connection of the user to mute from the store
			get connection() {
				return store.popup.connection;
			},
		};
	},
	methods: {
		// method to get the selected units
		selectCategory(event: Event) {
			this.selected = (event.target as HTMLInputElement).value;
		},

		// method called when validate
		validateInput() {
			let seconds = 0;

			// depending on the unit, multiply the value by the corresponding factor
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

			// create a partial connection containing id of the connection to mute and the date of the end of the mute
			const newConnection = {
				id: this.connection.id,
				mute_end: new Date(Date.now() + seconds * 1000),
			};

			// call to api to update the connection
			this.$axios
				.put(`/connections/${this.connection.id}`, newConnection)
				// if call success
				.then((response) => {
					// update the connection in the store
					store.connection.pushChanConnection([response.data]);

					// close the popup
					this.$modal.hide("mute_pannel");
				})
				// if catch some error, add an alert
				.catch(() => {
					this.$nuxt.$emit("addAlert", {
						type: "Error",
						message: `Failed to mute ${this.connection.user.username}`,
					});
				});
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
