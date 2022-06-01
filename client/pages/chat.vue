<template>
	<div id="app" class="w-screen h-screen overflow-hidden flex flex-col">
		<Header />
		<div id="page" class="flex flex-row items-center flex-grow min-h-0 min-w-0 overflow-x-auto">
			<div id="container-test" class="flex flex-row justify-between items-center overflow-y-hidden">
				<Chat />
			</div>
		</div>
	</div>
</template>

<style>
body {
	background-color: bg-design_gray;
	@apply bg-design_dgray;
}

.test {
	width: 20%;
	height: 100%;
	min-width: 20%;
	background-color: white;
}

#container-test {
	width: 100%;
	height: 100%;
	min-width: 300px;
	margin-left: auto;
	margin-right: auto;
}
</style>
