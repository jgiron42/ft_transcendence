<template>
	<modal :name="name">
		<div class="v-full h-full flex flex-col">
			<button class="text-white ml-auto mr-2 mt-1" @click="$modal.hide(name)">X</button>
			<slot />
		</div>
	</modal>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
	name: "Popup",
	props: {
		name: {
			type: String,
			required: true,
		},
	},
});
</script>
