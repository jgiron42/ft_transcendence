<template>
	<div
		class="w-full h-full flex flex-col items-center border-4 border-design_white bg-design_black overflow-hidden rounded-md"
	>
		<!-- Title -->
		<div
			id="title"
			class="text-design_white justify-center top-1/2 flex w-full border-b-2 border-design_white text-center bg-design_blue"
		>
			<div class="inline-block align-center uppercase text-6xl h-full">Welcome</div>
		</div>
		<!-- Select menu containing PROFILE and SECURITY tabs -->
		<div id="content" class="text-design_white w-full h-full overflow-y-scroll no-scrollbar">
			<WelcomeContent />
		</div>
		<!-- Save button -->
		<div id="inputs" class="text-design_white flex flex-row h-12 w-full bg-design_blue border-t-4 border-white">
			<button class="w-full text-center hover:text-gray-300" @click="save()">START TRANSCENDING</button>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import _ from "lodash";

export default Vue.extend({
	props: {
		selectionProp: {
			type: String,
			default: () => "Profile",
		},
	},
	data: () => ({
		selection: "Profile" as "Profile" | "2FA",
	}),
	mounted() {
		this.selection = this.selectionProp as "Profile" | "2FA";
		this.save = _.debounce(() => this.$nuxt.$emit("saveSettings" + this.selection), 200);
	},
	methods: {
		save: () => {},
	},
});
</script>
