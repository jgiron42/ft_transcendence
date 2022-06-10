<template>
	<modal name="my-modal">
		<div class="v-full h-full flex flex-col">
			<button class="text-white ml-auto mr-2 mt-1" @click="$modal.hide('my-modal')">X</button>
			<div class="text-sky-400 v-full h-full">
				<div class="text-white flex justify-center items-center h-full">This is a popup</div>
			</div>
		</div>
	</modal>
</template>
