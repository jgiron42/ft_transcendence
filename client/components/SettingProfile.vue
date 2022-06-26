<template>
	<div id="setting-profile" class="w-full h-full flex flex-col items-center justify-center bg-design_black">
		<div id="spacer" class="h-1/3"></div>
		<div class="flex flex-col w-full items-center justify-around">
			<div id="profile-picture" class="flex h-1/3 w-1/3 items-center justify-center">
				<img v-if="url" :src="url" class="rounded-full w-24 h-24" />
				<img v-else src="~/assets/profile.png" class="rounded-full w-24 h-24" />
			</div>
		</div>
		<div id="spacer" class="h-1/3"></div>
		<div class="flex h-full justify-center p-6">
			<input id="set-profile-btn" type="file" class="h-full" @change="onFileChange" />
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
	methods: {
		onFileChange(e: any) {
			const file = e.target.files[0];
			this.url = URL.createObjectURL(file);
		},
	},
});
</script>
