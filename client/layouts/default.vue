<!-- Don't change widths and heights in this layout, trust me -->
<template>
	<div id="app" class="w-full h-full overflow-hidden flex flex-col">
		<Header />
		<div id="page" class="flex flex-col flex-grow min-h-0 min-w-0 overflow-x-auto w-full h-full">
			<Nuxt />
		</div>
	</div>
</template>

<style>
body {
	scroll-behavior: smooth;
	background-color: bg-design_gray;
	@apply bg-design_dgray;
}
</style>
