<template>
	<div
		class="left-1/3 w-1/3 h-3/6 rounded absolute top-1/4 grid gap-2 bg-design_black content-around border-design_white border-4"
	>
		<p class="text-center text-design_white text-2xl">WHO ARE YOU ?</p>
		<div class="relative mx-auto"><img class="h-24 w-24 rounded-full" src="~/assets/profile.png" /></div>
		<button class="text-center text-design_white text-sm">CHANGE PICTURE</button>
		<input
			type="text"
			value="USERNAME"
			minlength="4"
			size="10"
			maxlength="8"
			class="bg-design_white rounded w-1/2 h-14 mx-auto text-center"
		/>
		<button class="text-design_white text-center text-2xl">SAVE</button>
	</div>
</template>
