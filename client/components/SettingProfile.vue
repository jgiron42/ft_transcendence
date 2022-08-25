<template>
	<div id="setting-profile" class="w-full h-full flex flex-col items-center bg-design_black py-5">
		<div class="flex flex-col w-full items-center justify-around">
			<!-- User profile picture -->
			<div id="profile-picture" class="flex h-1/3 w-1/3 items-center justify-center">
				<img v-if="url" :src="url" class="rounded-full w-24 h-24" />
				<img v-else-if="image" :src="image" class="rounded-full w-24 h-24" />
				<img v-else src="~/assets/profile.png" class="rounded-full w-24 h-24" />
			</div>
		</div>
		<input
			id="id-input"
			type="text"
			class="text-black box-content text-center font-mono mt-2"
			:value="user.username"
		/>
		<!-- Some space -->
		<div id="spacer" class="h-1/5"></div>
		<div class="flex justify-around w-10">
			<!-- Responsive file upload -->
			<input id="selectedFile" class="box-border" type="file" style="display: none" @change="onFileChange" />
			<input
				class="cursor-pointer box-border m-1 p-4 py-6 bg-design_blue break-words border-design_white border-4 rounded rounded-br-none text-md text-design_white text-center hover:text-gray-400"
				type="button"
				value="UPLOAD PICTURE"
				onclick="document.getElementById('selectedFile').click();"
			/>
		</div>
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
		};
	},
	async mounted() {
		// Send file to API when save button is clicked
		this.$nuxt.$on("saveSettingsProfile", this.saveSettings);

		// Get user data from API
		this.user = await (await this.$axios.get("/me")).data;

		// Set displayed img src
		getUserPictureSrc(this.$axios, this.user.id as string)
			.catch()
			.then((data: string) => (this.image = data));
	},
	methods: {
		onFileChange(e: any) {
			const file = e.target.files[0];
			this.url = URL.createObjectURL(file);
		},
		saveSettings() {
			const input = document.getElementById("id-input") as HTMLInputElement;

			if (input && input.value !== this.user.username) {
				this.user.username = input.value;
				this.$user.setUser(this.user);
				this.$user.save();
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
					this.$axios.$post("/users/picture", fd, {
						headers: {
							"content-type": "multipart/form-data", // do not forget this
						},
					});
				}
			}
		},
	},
});
</script>
