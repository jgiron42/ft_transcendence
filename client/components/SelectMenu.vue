<template>
	<div class="flex justify-center">
		<div>
			<select
				:id="idProp"
				class="box-content text-center form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
				aria-label="Default select example"
				@change="onChange($event)"
			>
				<option v-for="option in options" :key="option" :value="option">{{ option }}</option>
			</select>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
	props: {
		idProp: {
			type: String,
			required: true,
		},
		options: {
			type: Array,
			required: true,
		},
	},
	methods: {
		onChange(event: Event) {
			this.$nuxt.$emit(`${this.idProp}-change`, (event.target as HTMLInputElement).value);
		},
	},
});
</script>
