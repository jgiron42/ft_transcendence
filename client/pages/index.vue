<template>
	<div class="bg-gray-100">
		<p>Hello World!</p>
	</div>
</template>

<script lang="ts">
export default {
	name: "Index",
	methods: {
		/* Does not compile.
		getHello(): string
		{
			return 'Hello World!';
		},
		test() : Number
		{
			return this.getHello();
		}
	*/
	},
};
</script>

<style>
html,
body {
	scroll-behavior: smooth;
}

.vm--modal {
	@apply rounded-lg;
}
</style>
