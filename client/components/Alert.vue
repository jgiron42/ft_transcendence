<template>
	<div class="sticky bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-full" role="alert">
		<strong class="font-bold">{{ title }} | </strong>
		<span class="block sm:inline">{{ message }}</span>
		<span class="absolute top-0 bottom-0 right-0 px-4 py-3">
			<CloseAlertLogo @click="onClick()" />
		</span>
	</div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
	props: {
		title: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		idProp: {
			type: Number,
			required: true,
		},
	},
	methods: {
		onClick() {
			this.$nuxt.$emit("delAlert", this.idProp);
		},
	},
});
</script>
