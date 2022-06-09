<template>
	<div
		class="w-full h-full flex flex-col items-center border-4 border-design_white bg-design_black overflow-hidden rounded-md"
	>
		<div
			id="tittle"
			class="text-design_white h-8 justify-center top-1/2 flex w-full border-b-2 border-design_white text-center bg-design_blue"
		>
			<div class="inline-block align-center">SETTINGS</div>
		</div>
		<div id="menu-select" class="text-design_white flex flex-row h-12 w-full">
			<button
				class="w-1/2 text-center"
				:class="
					selected
						? 'bg-design_black text-design_white hover:bg-design_dgray'
						: 'text-design_black bg-design_white hover:bg-design_gray'
				"
				@click="selected = false"
			>
				PROFILE
			</button>
			<button
				class="w-1/2 text-center"
				:class="
					!selected
						? 'bg-design_black text-design_white hover:bg-design_dgray'
						: 'text-design_black bg-design_white hover:bg-design_gray'
				"
				@click="selected = true"
			>
				SECURITY
			</button>
		</div>
		<div id="content" class="text-design_white w-full h-full">
			<SettingProfile2FA v-if="selected" />
			<SettingProfile v-else />
		</div>
		<div id="inputs" class="text-design_white flex flex-row h-12 w-full bg-design_blue border-t-4 border-white">
			<button class="w-full text-center">SAVE</button>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
	data: () => ({
		selected: false,
	}),
});
</script>
