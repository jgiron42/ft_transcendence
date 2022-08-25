<template>
	<div id="setting-profile" class="w-full h-full flex flex-col items-center justify-around bg-design_black py-5">
		<div class="flex flex-col w-full items-center justify-around">
			<!-- User profile picture -->
			<div
				id="profile-picture"
				onclick="document.getElementById('selectedFile').click();"
				class="flex h-1/3 w-1/3 items-center justify-center cursor-pointer"
			>
				<img v-if="url" :src="url" class="rounded-full w-24 h-24" />
				<img v-else-if="image" :src="image" class="rounded-full w-24 h-24" />
				<img v-else src="~/assets/profile.png" class="rounded-full w-24 h-24" />
			</div>
			<input
				id="id-input"
				type="text"
				class="text-black box-content text-center font-mono mt-2"
				:value="user.username"
			/>
		</div>
		<!-- Player statistics -->
		<div class="flex flex-col">
			<p>Total played games : {{ user.nb_game }}</p>
			<p>Total victories : {{ user.nb_win }}</p>
			<p>Total losses : {{ user.nb_loss }}</p>
			<p>ELO rating: {{ user.elo }}</p>
		</div>
		<NuxtLink class="uppercase" to="/history">See match history</NuxtLink>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { User } from "~/models/User";
import getUserPictureSrc from "@/utils/getUserPictureSrc";
export default Vue.extend({
	data() {
		return {
			user: {} as User,
			url: "",
			image: "",
			lastSave: 0,
		};
	},
	mounted() {
		// Send file to API when save button is clicked
		this.$nuxt.$on("saveSettingsProfile", this.saveSettings);

		// Get user data from API
		this.$axios
			.get("/me")
			.then((user) => {
				this.user = user.data;

				// Set displayed img src
				getUserPictureSrc(this.$axios, this.user.id as string)
					.catch()
					.then((data: string) => (this.image = data));
			})
			.catch((err) =>
				this.alert.emit({ title: "SETTINGS", message: `Could not fetch user data: ${err.toString()}` }),
			);
	},
	methods: {
		onFileChange(e: any) {
			const file = e.target.files[0];
			this.url = URL.createObjectURL(file);
		},
		saveSettings() {
			if (Date.now() - this.lastSave < 1000) return;

			this.lastSave = Date.now();
			const input = document.getElementById("id-input") as HTMLInputElement;

			if (input && input.value !== this.user.username) {
				this.user.username = input.value;
				this.$user.setUser(this.user);

				this.$user
					.save()
					.then(() =>
						this.alert.emit({
							title: "SETTINGS",
							message: "PROFILE SUCCESSFULLY UPDATED",
							isError: false,
						}),
					)
					.catch((err) => this.alert.emit({ title: "SETTINGS", message: err.toString() }));
			}

			if (this.url) {
				// Get file input HTML element
				const input = document.getElementById("selectedFile") as HTMLFormElement;

				// Ensure the element exist and it has files
				if (input && input.files) {
					// Create a new form for storing picture file to be sent
					const fd = new FormData();

					// Add picture file to form data
					fd.append("file", input.files[0]);

					// Post form data to API
					this.$axios
						.$post("/users/picture", fd, {
							headers: {
								"content-type": "multipart/form-data", // do not forget this
							},
						})
						.then(() =>
							this.alert.emit({
								title: "SETTINGS",
								message: "PROFILE SUCCESSFULLY UPDATED",
								isError: false,
							}),
						)
						.catch((err) => this.alert.emit({ title: "SETTINGS", message: err.toString() }));
				}
			}
		},
	},
});
</script>
