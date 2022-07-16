<template>
	<div id="setting-profile" class="w-full h-full flex flex-col items-center bg-design_black py-5">
		<div class="flex flex-col w-full items-center justify-around">
			<div id="profile-picture" class="flex h-1/3 w-1/3 items-center justify-center">
				<img v-if="url" :src="url" class="rounded-full w-24 h-24" />
				<img v-else src="~/assets/profile.png" class="rounded-full w-24 h-24" />
			</div>
		</div>
		<div id="spacer" class="h-1/5"></div>
		<div class="flex justify-around w-10">
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
export default Vue.extend({
	data() {
		return {
			url: "",
		};
	},
	mounted() {
		this.$nuxt.$on("saveSettingsProfile", this.sendFile);
	},
	methods: {
		onFileChange(e: any) {
			const file = e.target.files[0];
			this.url = URL.createObjectURL(file);
		},
		sendFile() {
			const input = document.getElementById("selectedFile") as HTMLFormElement;
			if (input && input.files) {
				console.log("sending file:", input.files[0]);
			}
		},
	},
});
</script>
