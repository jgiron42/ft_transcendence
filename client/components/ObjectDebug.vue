<template>
	<pre class="text-justify" :class="classes">{{ stringified }}</pre>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
	props: {
		title: {
			type: String,
			default: () => "",
		},
		object: {
			type: Object,
			default: () => {},
		},
		array: {
			type: Array,
			default: () => [],
		},
	},
	data: () => ({
		classes:
			"font-mono p-4 py-6 break-words border-design_white border-4 rounded rounded-br-none text-3xl text-design_white cursor-default",
		stringified: "empty",
	}),
	mounted() {
		this.stringified = (this.title ? this.title + "\n" : "") + JSON.stringify(this.object || this.array, null, 2);
	},
});
</script>
