<template>
	<div
		class="min-w-max w-full h-full flex flex-col items-center border-4 border-design_white bg-design_black overflow-hidden rounded-md"
	>
		<div
			id="title"
			class="text-design_white h-8 justify-center top-1/2 flex w-full border-b-2 border-design_white text-center bg-design_blue"
		>
			<div class="inline-block align-center">SETTINGS</div>
		</div>
		<div id="menu-select" class="text-design_white flex flex-row h-12 w-full">
			<button
				class="w-1/2 text-center p-1"
				:class="
					selection != 'Profile'
						? 'bg-design_black text-design_white hover:bg-design_dgray'
						: 'text-design_black bg-design_white hover:bg-design_gray'
				"
				@click="selection = 'Profile'"
			>
				PROFILE
			</button>
			<button
				class="w-1/2 text-center p-1"
				:class="
					selection != '2FA'
						? 'bg-design_black text-design_white hover:bg-design_dgray'
						: 'text-design_black bg-design_white hover:bg-design_gray'
				"
				@click="selection = '2FA'"
			>
				SECURITY
			</button>
		</div>
		<div id="content" class="text-design_white w-full h-full">
			<SettingProfile2FA v-if="selection == '2FA'" />
			<SettingProfile v-else />
		</div>
		<div id="inputs" class="text-design_white flex flex-row h-12 w-full bg-design_blue border-t-4 border-white">
			<button class="w-full text-center hover:text-gray-300" @click="$nuxt.$emit('saveSettings' + selection)">
				SAVE
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

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
	},
});
</script>
