<template>
	<div
		:class="`${font} m-1 p-4 py-6 ${color} break-words border-design_white border-4 rounded rounded-br-none text-3xl text-design_white text-center cursor-default`"
	>
		<slot />
	</div>
</template>
<script lang="ts">
export default {
	props: {
		color: {
			type: String,
			default: "bg-design_blue",
		},
		font: {
			type: String,
			default: "",
		},
	},
};
</script>
