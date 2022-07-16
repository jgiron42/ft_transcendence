<template>
	<button
		:class="`${font} m-1 p-4 py-6 ${color} break-words border-design_white border-4 rounded rounded-br-none ${size} text-design_white text-center ${
			enableHover ? 'hover:text-gray-400' : 'cursor-default'
		}`"
	>
		<p v-for="(line, index) in content" :key="index">
			{{ line }}
		</p>
	</button>
</template>
<script lang="ts">
export default {
	name: "BoxButton",
	props: {
		content: {
			type: Array,
			required: true,
			default: () => ["DEFAULT TITLE"],
		},
		color: {
			type: String,
			default: "bg-design_blue",
		},
		enableHover: {
			type: Boolean,
			default: true,
		},
		font: {
			type: String,
			default: "",
		},
		size: {
			type: String,
			default: "text-3xl",
		}
	},
};
</script>
<style>
.wrap-this {
	overflow-wrap: break-word;
	word-wrap: break-word;
	-ms-word-break: break-all;
	word-break: break-word;
	hyphens: auto;
}
</style>
