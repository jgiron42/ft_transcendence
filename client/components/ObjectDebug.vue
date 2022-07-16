<template>
	<pre :class="classes">{{ stringified }}</pre>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
	props: {
		param: {
			type: Object,
			required: true,
			default: {} as object,
		},
	},
	data: () => ({
		classes:
			"font-mono p-4 py-6 break-words border-design_white border-4 rounded rounded-br-none text-3xl text-design_white cursor-default",
		stringified: "empty",
	}),
	mounted() {
		this.stringified = JSON.stringify(this.param, null, 2);
	},
});
</script>
