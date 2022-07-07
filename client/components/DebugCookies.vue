<template>
	<BoxButton font="font-mono" :content="cookies" />
</template>

<script lang="ts">
export default {
	data: () => ({
		cookies: document.cookie.split(";"),
	}),
	mounted() {
		console.log("cookies:", document.cookie);
	},
};
</script>
