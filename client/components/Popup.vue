<template>
	<modal :name="name">
		<div class="v-full h-full flex flex-col">
			<button class="text-white ml-auto mr-2 mt-1" @click="$modal.hide(name)">X</button>
			<Component :is="__component__" />
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
		component: {
			type: String,
			required: true,
		},
	},
	computed: {
		__component__() {
			return () => import(`@/components/${this.component}.vue`);
		},
	},
});
</script>
