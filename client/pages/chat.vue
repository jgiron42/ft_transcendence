<template>
    <div id="app" class="w-screen h-screen overflow-hidden flex flex-col">
		<Header />	
		<div id="page" class="flex flex-col items-center flex-grow min-h-0">
			<br>
			<div id="container-test" class="flex flex-row justify-between items-center overflow-y-scroll pb-[15px] gap-10 ">
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

#container-test {
	width: 50%;
	height: 100%;
}
</style>
