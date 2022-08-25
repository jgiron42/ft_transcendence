<template>
	<div
		:class="`sticky  border ${
			isError ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'
		} px-4 py-3 rounded w-full`"
		role="alert"
	>
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
		isError: {
			type: Boolean,
			required: false,
			default: true,
		},
	},
	methods: {
		onClick() {
			this.$nuxt.$emit("delAlert", this.idProp);
		},
	},
});
</script>
